const pool = require("../pool");
const shortId = require("../config/shortId");
const sendMail = require("../middlewares/send.email");

// const queryString= (values)=>{}

class bookController {
  //Lấy thông tin tất cả các vé 
  async index(req, res) {
    const { token, user } = res.locals;

    let { _limit, page } = req.query;
    try {
      _limit ? _limit : (_limit = 15);
      page ? page : (page = 1);
      let data = await pool.query(`
                  select t.*, c.name as user_name , c.email, 
                     fs.price , l1.name as _from, l2.name as _to,
                     a.name as airline, s.name as seat, f._start, f._end
                  from ticket as t
                  inner join contacts as c on t.contact_id = c.id
                  inner join flight_seat as fs on t.flight_seat = fs.id
                  inner join flight as f on f.id= fs.flight_id
                  inner join seats as s on s.id = fs.seat_id
                  inner join locations as l2  on f._to= l2.id
                  inner join locations as l1 on f._from=l1.id
                  inner join airlines as a on f.airline= a.id
                  ORDER BY t.id DESC
                  limit ${_limit} offset ${(page - 1) * _limit}
                `);
      res.json({ token, data: data.rows });
    } catch (error) {
      res.json({ err: error, token });
    }
  }
  //Lấy thông tin tất cả các vé của 1 người(Đã đăng ký tài khoản)
  async getAllBookOfUser(req, res) {
    const { token, user } = res.locals;
    try {
      let { _limit, page } = req.query;
      _limit ? _limit : (_limit = 15);
      page ? page : (page = 1);
      console.log(user.id);
      let data = await pool.query(
        `
                select t.*, c.name as user_name , c.email, 
                   fs.price , l1.name as _from, l2.name as _to,
                   a.name as airline, s.name as seat, f._start, f._end
                from ticket as t
                inner join contacts as c on t.contact_id = c.id
                inner join flight_seat as fs on t.flight_seat = fs.id
                inner join flight as f on f.id= fs.flight_id
                inner join seats as s on s.id = fs.seat_id
                inner join locations as l2  on f._to= l2.id
                inner join locations as l1 on f._from=l1.id
                inner join airlines as a on f.airline= a.id
                where t.user_id=$1
                limit ${_limit} offset ${(page - 1) * _limit}
            `,
        [user.id]
      );
      res.json({ token, data: data.rows });
    } catch (error) {
      res.json({ data: error, token });
    }
  }
  //Lấy thông tin vé đã book
  async getBook(req, res) {
    const { token, user } = res.locals;
    try {
      const { id } = req.params;
      const data = await pool.query(
        `
                select t.*, c.name as user_name , c.email, 
                   fs.price , l1.name as _from, l2.name as _to,
                   a.name as airline, s.name as seat, f._start, f._end
                from ticket as t
                inner join contacts as c on t.contact_id = c.id
                inner join flight_seat as fs on t.flight_seat = fs.id
                inner join flight as f on f.id= fs.flight_id
                inner join seats as s on s.id = fs.seat_id
                inner join locations as l2  on f._to= l2.id
                inner join locations as l1 on f._from=l1.id
                inner join airlines as a on f.airline= a.id
                where t.id=$1
            `,
        [id]
      );
      res.json({ token, data: data.rows[0] });
    } catch (error) {
      res.json({ token, err: error });
    }
  }
  //Lấy tất cả các vé chưa xác nhận
  async getBookNotVerify(req, res) {
    const {token}= res.locals
    try {
      const data = await pool.query(`
      select t.*, c.name as user_name , c.email, 
         fs.price , l1.name as _from, l2.name as _to,
         a.name as airline, s.name as seat, f._start, f._end
      from ticket as t
      inner join contacts as c on t.contact_id = c.id
      inner join flight_seat as fs on t.flight_seat = fs.id
      inner join flight as f on f.id= fs.flight_id
      inner join seats as s on s.id = fs.seat_id
      inner join locations as l2  on f._to= l2.id
      inner join locations as l1 on f._from=l1.id
      inner join airlines as a on f.airline= a.id
      where t.verify= false
      `);
      res.json({
        token,
        data: data.rows
      })
    } catch (error) {
      res.json({
        err: 'Lỗi không nhận được giá trị',
        token
      })
    }
  }
  //Đặt vé
  async book(req, res) {
    const { contactId, token, clientId, email } = res.locals;
    try {
      const { ticket } = req.body;
      let {flight_seat, quantity, date_flight}= ticket
      let [t1, t2, t3] = date_flight.split('/')
      date_flight= `${t2}/${t1}/${t3}`
      const id = shortId.generate();
      const values = [id, clientId, contactId, quantity, flight_seat, date_flight];
      await pool.query(
        `
               insert into ticket(id, user_id, contact_id, quantity,flight_seat,  date_flight)
               values ($1,$2,$3,$4,$5, $6)
            `,
        values
      );

      res.json({
        message:
          "Mua vé thành công, bạn hãy vào email để xem thông tin sản phẩm",
        token,
        clientId,
      });
    } catch (error) {
      //Xóa contact vừa tạo
      await pool.query(`delete from customers where contact_id=$1`,[contactId])
      await pool.query(`delete from contacts where id=$1`, [contactId]);
      res.json({ token, err: "Mua vé không thành công" });
    }
  }
  //Xác nhận đặt vé
  async verifyBooking(req, res) {
    const { token } = res.locals;
    const { id } = req.params;
    const {email}= req.body
    try {
      const data = await pool.query(
        `
          update ticket
          set verify=true where id=$1 and verify= false
        `,
        [id]
      );
      if (data.rowCount === 0) {
        res.json({ token, err: "Đã xác nhận vé này" });
        return;
      } else {
        
        let url = `http://localhost:8081/order/search/${id}`;
        await sendMail(url, email, id);
        res.json({ token, message: "Xác nhận thành công", });
      }
    } catch (error) {
      await pool.query("delete from ticket where contact=$1", [id]);
      await pool.query("delete from customers where contact_id=$1", [id]);
      await pool.query("delete from contacts where id=$1", [id]);
      res.json({ err: "Không đủ vé" });
    }
  }
  //Hủy vé
  async deleteBook(req,res){
    const {id, token}= req.params
    const {contact_id}= res.locals
    console.log(contact_id, id)
    try {
      await pool.query(` delete from customers where contact_id=$1;`,[contact_id])
      await pool.query(`  delete from ticket where id=$1;`,[id]);
      await pool.query(`  delete from contacts where id=$1;`,[contact_id])
      res.json({
        message:'Hủy chuyến bay thành công',
        token
      })
    } catch (error) {
      res.json({
        err: error,
        token
      })
    }
    
  }
}

module.exports = new bookController();
