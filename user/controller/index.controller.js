const pool = require("../pool");
const shortId = require("../config/shortId");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const sendEmail = require("../middleware/send.email");
const resetPassword= require('../middleware/reset.password')

let session = [];
class userController {
  // [get] information of all user (admin)
  async index(req, res) {
    if (res.locals.user.name === "admin") {
      const data = await pool.query("select * from users");
      const token = res.locals.token;
      res.json({ data: data.rows, token });
    } else {
      res.json({ err: "Bạn không có quyền truy cập!!!" });
    }
  }
  // [post] register
  async register(req, res) {
    try {
      let { name, email, password } = req.body || res.locals.data;
      const id = shortId.generate();
      password = md5(password);
      const values = [id, name, email, password];
      let data = await pool.query(
        `INSERT INTO USERS(id,name, email, password)
                 VALUES($1,$2,$3,$4) 
                `,
        values
      );
      session.push(id);
      const link = `http://localhost:${process.env.PORT}/api/users/verify/${id}`;
      sendEmail(link, email);
      res.json({ message: "Bạn cần kích hoạt tài khoản" });
    } catch (error) {
      res.json({ err: "Email này đã tồn tại!!!" });
    }
  }
  // verify user
  async verifyUser(req, res) {
    try {
      const id = req.params.id;
      if (session.includes(id)) {
        session = session.filter((value) => value !== id);
        pool.query(
          `
                   update users set verify=true where id=$1
                `,
          [id]
        );
        res.send("Xác nhận email thành công");
      } else {
        res.send("Xác nhận thất bại");
      }
    } catch (error) {
      res.send("Xác nhận thất bại");
    }
  }
  // login
  async login(req, res) {
    const user = res.locals.user;
    const accesstoken = jwt.sign(user, process.env.ACCESS_SECRET, {
      expiresIn: "600s",
    });
    const refreshtoken = jwt.sign(user, process.env.REFRESH_SECRET, {
      expiresIn: "2h",
    });
    const token = { accesstoken, refreshtoken };
    res.json({ token, user });
  }
  // View information of user
  async getUser(req, res) {
    try {
      const { user, token } = res.locals;
      const { id } = req.params;
      if (user.id === id || user.name === "admin") {
        let data = await pool.query(
          `
                 select * from users where id=$1
              `,
          [user.id]
        );
        data = { data: data.rows[0], token };
        delete data.password;
        res.json(data);
      } else {
        res.json({ err: "Bạn không có quyền này", token });
      }
    } catch (error) {
      res.json({ err: "Bạn không có quyền truy cập vào tài khoản này" });
    }
  }
  // Chage password
  async chagePassword(req, res) {
    try {
      const { user, token } = res.locals;
      let { password, newPassword } = req.body;
      password = md5(password);
      newPassword = md5(newPassword);
      const values = [newPassword, password, user.email];
      let oldPassword = await pool.query(
        `
              select password from users where id=$1
            `,
        [user.id]
      );
      if (oldPassword.rows[0].password === password) {
        let data = await pool.query(
          `
                   update users
                   set password=$1
                   where password=$2 and email=$3;
                `,
          values
        );
        res.json({ token, message: "Đổi mật khẩu thành công" });
        return;
      } else {
        res.json({ err: "Sai mật khẩu" });
      }
    } catch (error) {
      res.json({ err: "Sai mật khẩu" });
    }
  }
  // Reset password
  async resetPassword(req,res){
    try {
      const {email}= req.body
      const data= await pool.query('select * from users where email=$1',[email])
      if(data.rowCount!==1){
        res.json({err:'Không tồn tại tài khoản này'})
      } else{
        const {id}= data.rows[0]
        const newPassword= shortId.generate()
        const link = `http://localhost:${process.env.PORT}/api/users/reset-password/verify/${newPassword}?id=${id}`;
        session.push(id)
        await resetPassword(link, email, newPassword)
        res.json({message: 'Bạn hãy vào email để lấy lại mật khẩu'})
      }
    } catch (error) {
      res.json({err: 'Không tông tại tài khoản này'})
    }
  }
  //Verify reset password
  async verifyResetPassword(req,res){
    try {
      let {newPassword}=req.params
      newPassword= md5(newPassword)
      const {id}= req.query
      console.log(session, id)
      if(session.includes(id)){
        session = session.filter((value) => value !== id);
        const data= await pool.query(`
          update users
          set password=$1
          where id=$2
        `,[newPassword, id])
        if(data.rowCount!==1){
          res.json({err: 'Reset password không thành công'})
        } else{
          res.json({message:'Reset password thành công'})
        }
      } else{
        res.json({err:'Đã reset password trước đó'})
      }
    } catch (error) {
      res.json({err: 'Reset password không thành công'})
    }
  }
  //Delete user(admin)
  async deleteUser(req, res) {
    const { user, token } = res.locals;
    if (user.name === "admin") {
      const id = req.params.id;
      try {
        await pool.query(
          `
                 delete from users where id=$1
              `,
          [id]
        );
        res.json({ token, message: "Xóa tài khoản thành công" });
      } catch (error) {
        res.json({ err: "Tài khoản này đã có thông tin liên quan" });
      }
    } else {
      res.json({ err: "Bạn không có quyền xóa tài khoản này" });
    }
  }
  async deleteAllInformation(req, res) {
    const { user, token } = res.locals;
    if (user.name === "admin") {
      const id = req.params.id;
      try {
        await pool.query(`delete from user_ticket where user_id=$1;`, [id]);
        await pool.query(`delete from customers where user_id=$1;`, [id]);
        let data = await pool.query(`delete from users where id=$1;`, [id]);
        if (data.rowCount === 1) {
          res.json({ token, message: "Xóa tài khoản thành công" });
        } else {
          res.json({ err: "Không tồn tại tài khoản này" });
        }
      } catch (error) {
        res.json({ err: "Xóa tài khoản thất bại" });
      }
    } else {
      res.json({ err: "Bạn không có quyền xóa tài khoản này" });
    }
  }
  // Authozication cho server khác
  async authozication(req, res) {
    const { user, token } = res.locals;
    res.json({ user, token });
  }
  //Thay đổi thông tin người dùng
  async changeInformation(req, res){
    const { token, template, values} = res.locals
    try {
      const data= await pool.query(template, values)
      if(data.rowCount===1){
        res.json({token, message: 'Thay đổi thông tin người dùng thành công'})
        return
      }
    } catch (error) {
      res.json({token, err: 'Thay đổi thông tin người dùng thất bại thất bại'})
    }
  }
}
module.exports = new userController();
