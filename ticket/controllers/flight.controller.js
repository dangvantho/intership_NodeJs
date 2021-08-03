const shortId = require("../config/shortId");
const pool = require("../pool");
async function checkExistTicket(values) {
  const data = await pool.query(
    `
       select * from flight 
       where _from=$1 and _to=$2 and weekday=$3 
          and _start=$4 and _end=$5 and airline=$6 
          and date_start =$7 and date_end=$8
    `,
    values
  );
  if (data.rowCount === 0) {
    return false;
  } else {
    return true;
  }
}
async function getFlightSeat(flight){
  try {
    const data=await pool.query(`select *  from flight_seat where flight_id=$1`,[flight.id])
    return {
      flight,
      flight_seat: data.rows
    }
  } catch (error) {
    return error
  }
  
}
async function putFlightSeat(values){
  try {
    await pool.query(`
      update flight_seat set price=$1, quantity=$2 where id= $3
    `,[values.price, values.quantity, values.id])
    return {message:'Update thành công'}
  } catch (error) {
    return new Error(`Update ${values.id} thất bại`)
  }
}
class ticketController {
  // Lấy thông tin tất cả vé máy bay
  async index(req, res) {
    const { token } = res.locals;
    try {
      let { _limit, page } = req.query;
      _limit ? _limit : (_limit = 15);
      page ? page : (page = 1);
      await pool.query(`
        select f.*,
          l1.name as _from, l2.name as _to, a.name as airline
        from flight as f
        inner join locations as l1 on f._from=l1.id
        inner join locations as l2 on f._to=l2.id
        inner join airlines as a on f.airline=a.id
        limit ${_limit} offset ${(page - 1) * _limit}       
      `).then(data=>{
        Promise.all(data.rows.map(async flight=>{
          return await getFlightSeat(flight)
        })).then(values=>{
          console.log(values)
          res.json({
            token,
            data: values
          })
        }).catch(err=>{
          res.json({err, token})
        })
      })
    } catch (error) {
      res.json({ token, err: error });
    }
  }
  //   Thêm vé máy bay
  async addTicket(req, res) {
    const { token } = res.locals;
    try {
      const values = res.locals.values;
      const { flight_seat } = req.body || res.locals.data;
      const exist = await checkExistTicket(values);
      if (exist) {
        res.json({ err: "Đã tồn tại vé này" });
      } else {
        //Thêm vé máy bay
        await pool
          .query(
            `
            insert into 
             flight(_from, _to, weekday, _start, _end, airline, date_start, date_end)
            values ($1,$2,$3,$4,$5,$6,$7,$8)
            returning *
          `,
            values
          )
          .then(async (flight) => {
            //Thêm flight_seat
            let { id } = flight.rows[0];
            let data = [];
            for (let value of flight_seat) {
              const { price, quantity, seat_id } = value;
              const response = await pool.query(
              `
                insert into flight_seat(flight_id, price, quantity, seat_id)
                values ($1,$2,$3,$4) returning *;
              `,
                [id, price, quantity, seat_id]
              );
              data.push(response.rows[0]);
            }
            res.json({
              token,
              message: "Thêm vé bay thành công",
              data: {
                flight: flight.rows[0],
                flight_seat: data,
              },
            });
          }).catch(err=>{
            res.json({
              err,
              token
            })
          })
      }
    } catch (error) {
      res.json({ err: error, token });
    }
  }
  //   Lấy thông tin chuyến bay cụ thể
  async get(req, res) {
    const { token } = res.locals;
    try {
      const { id } = req.params;
      let data = await pool.query(
        `
      select t.id, t._time, t.quantity, t.price,
            l1.name as _from, l2.name as _to, 
            s.name as seat, a.name as airline
      from info_ticket as t
      inner join locations as l1 on t._from=l1.id
      inner join locations as l2 on t._to=l2.id
      inner join airlines as a on t.airline=a.id
      inner join seats as s on t.seat= s.id
      where t.id=$1 
      `,
        [id]
      );
      res.json({ token, data: data.rows[0] });
    } catch (error) {
      res.json({ token, err: "Không tìm thấy chuyến bay này" });
    }
  }
  //   Sửa đổi thông tin vé máy bay
  async put(req, res) {
    const { token, user } = res.locals;
    try {
      let values = res.locals.values;
      const {flight, flight_seat}= req.body
      await pool.query(`
        update flight set isdelete=$1 where id=$2
      `,[flight.isdelete, flight.id])
      Promise.all(flight_seat.map(value=>{
        return putFlightSeat(value)
      })).then(()=>{
        res.json({
          message:'Update thành công',
          token,
        })
      }).catch(err=>{
        res.json({err, token})
      })
    } catch (error) {
      res.json({ token, err: error });
    }
  }
  //   Xóa chuyến bay
  async delete(req, res) {
    const { user, token } = res.locals;
    try {
      const { id } = req.params;
      const data = await pool.query("update flight set isdelete=true where id=$1", [id]);
      if (data.rowCount === 1) {
        res.json({ token, message: "Xóa thành công" });
      } else {
        res.json({ token, err: "Không tồn tại vé máy bay này" });
      }
    } catch (error) {
      res.json({ token, err: "Không thể xóa vé này" });
    }
  }
  //   Tìm kiếm vé máy bay
  async filter(req, res) {
    const { values, template, token } = res.locals;
    try {
      const data = await pool.query(template, values);
      Promise.all(data.rows.map(flight=>{
        return getFlightSeat(flight)
      })).then(values=>{
        res.json({ token, data: values });
      })
    } catch (error) {
      res.json({ token, err: error });
    }
  }
  async sort(req, res) {
    const { values, template, token } = res.locals;
    console.log(values, template);
    try {
      const data = await pool.query(template, values);
      Promise.all(
        data.rows.map(async (value) => {
          return getName(value);
        })
      ).then((data) => {
        res.json({ token, data });
      });
    } catch (error) {
      res.json({ token, err: error });
    }
  }
}

module.exports = new ticketController();
