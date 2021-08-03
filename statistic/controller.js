const pool = require("./pool");
class controller {
  //Lây thông tin tất cả các vé đã bán được theo hãng
  async airlines(req, res) {
    const { token, user } = res.locals;
    const { id } = req.params;
    try {
      const name= await pool.query('select name from airlines where id=$1',[id])
      const data = await pool.query(
        `
                  select 
                    a.name as airline, t.id as ticket_id
                  from airlines as a 
                  inner join flight as f on a.id= f.airline
                  inner join flight_seat as fs on fs.flight_id = f.id
                  inner join ticket as t on t.flight_seat= fs.id
                  where t.verify=true and a.id=$1
                `,
        [id]
      );
      res.json({
        data: {
          id,
          data: data.rows,
          count: data.rowCount,
          name: name.rows[0].name,
        },
        token,
      });
    } catch (error) {
      res.json({ err: error, token });
    }
  }
  //Lấy thông tin tất cả các vé máy bay bán được theo laoij ghế
  async seats(req, res) {
    const { token, user } = res.locals;
    const { id } = req.params;
    try {
      const name= await pool.query('select name from seats where id=$1',[id])
      const data = await pool.query(
        `
                  select 
                    s.name as seat, t.id as ticket_id
                  from seats as s
                  inner join flight_seat as fs on fs.seat_id = s.id
                  inner join ticket as t on t.flight_seat= fs.id
                  where t.verify=true and s.id=$1
                `,
        [id]
      );
      res.json({
        data: {
          id,
          data: data.rows,
          count: data.rowCount,
          name: name.rows[0].name,
        },
        token,
      });
    } catch (error) {
      res.json({ err: error, token });
    }
  }
}

module.exports = new controller();
