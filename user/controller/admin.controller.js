const md5 = require("md5");
const jwt = require("jsonwebtoken");
const pool = require("../pool");
const resetPassword= require('../middleware/reset.password')
const shortId= require('../config/shortId');
const { emit } = require("../pool");

let session = [];
class adminController {
  async login(req, res) {
    let { email, password } = req.body;
    password = md5(password);
    const data = await pool
      .query(
        `
           select id, email, name from admin where email= $1 and password=$2
        `,
        [email, password]
      )
      .catch((err) => {
        res.json({ err });
        return;
      });
    if (data.rowCount === 0) {
      res.json({ err: "Sai password hoặc mật khẩu" });
      return;
    } else {
      const user = data.rows[0];
      const accesstoken = jwt.sign(user, process.env.ACCESS_SECRET, {
        expiresIn: "600s",
      });
      const refreshtoken = jwt.sign(user, process.env.REFRESH_SECRET, {
        expiresIn: "2h",
      });
      const token = { accesstoken, refreshtoken };
      res.json({ token, user });
    }
  }
  async register(req, res) {
    let { name, password, email } = req.body;
    password = md5(password);
    let data= await pool
      .query(
        `
           insert into admin(name, password, email)
           values ($1, $2, $3)
           returning id, name, email
        `,
        [name, password, email]
      ).catch((err) => {
        res.json({ err: "Đã tồn tại tài khoản này" });
        return
      });
      res.json({
        message: "Thêm admin thành công",
        data: data.rows[0],
      });
  }
  //Xóa quyền quản trị của admin
  async deleteUser(req, res) {
    const { user, token } = res.locals;
    const { id } = req.params;
    if (user.name !== "admin") {
      res.json({ err: "Bạn không có quyền này" });
      return;
    }
    await pool
      .query("delete from admin where id=$1", [id])
      .then(() => {
        res.json({
          message: "Xóa tài khoản thành công",
          token: token,
        });
      })
      .catch((err) => {
        res.json({ err });
      });
  }
  //  Lấy thông tin toàn bộ admin
  async getAll(req, res) {
    const { user, token } = res.locals;
    if (user.name !== "admin") {
      res.json({ err: "Bạn không có quyền này" });
      return;
    }
    await pool
      .query("select id, name, email from admin where id <> 1")
      .then(data => {
        res.json({
          data: data.rows,
          token: token,
        });
      })
      .catch((err) => {
        res.json({ err });
      });
  }
  //Sửa password user quản lý
  async changePassword(req, res){
      const { user, token }= res.locals
      try {
        let {newPassword, password}= req.body
        newPassword= md5(newPassword)
        password= md5(password)
        let data= await pool.query(`
          update admin set password=$1 where email=$2 and password=$3
        `,[newPassword ,user.email, password])
        if(data.rowCount===0){
            res.json({err: 'Không tồn tại tài khoản này'})
            return
        }
        res.json({
            message:'Thay đổi mật khẩu thành công',
            token
        })
      } catch (error) {
        res.json({err: error})  
      }
  }
  //Authozication
  auth(req,res){
    const { user, token } = res.locals;
    res.json({ user, token });
  }
  // Reset password
  async resetPassword(req,res){
    try {
      const {email}= req.body
      const data= await pool.query('select * from admin where email=$1',[email])
      console.log(data.rows, data.rowCount)
      if(data.rowCount!==1){
        res.json({err:'Không tồn tại tài khoản này'})
        return
      } else{
        const {id}= data.rows[0]
        const newPassword= shortId.generate()
        const link = `http://localhost:${process.env.PORT}/api/admin/reset-password/verify/${newPassword}?id=${id}`;
        session.push(id)
        await resetPassword(link, email, newPassword)
        res.json({message: 'Bạn hãy vào email để lấy lại mật khẩu'})
        return
      }
    } catch (error) {
      console.log(error)
      res.json({err: error})
    }
  }
  //Verify reset password
  async verifyResetPassword(req,res){
    try {
      let {newPassword}=req.params
      newPassword= md5(newPassword)
      let {id}= req.query
      
      if(session.includes(id-0)){
        session = session.filter((value) => value !== id);
        const data= await pool.query(`
          update admin
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
  //Thay đổi thông tin người dùng
  async changeInformation(req, res){
    const { token, user } = res.locals
    const {email, name}= req.body
    if(!email || !name){
      res.json({
        err: 'Thiếu name hoặc email',
        token
      })
      return
    }
    try {
      const data= await pool.query(`
         update admin set name=$1 , email=$2 where id=$3
      `,[name, email, user.id])
      if(data.rowCount===1){
        res.json({
          message:'Thay đổi thông tin admin thành công',
          token
        })
        return
      }else{
        res.json({
          err:'Không tồn tại tài khoản này',
          token
        })
        return
      }
    } catch (error) {
      res.json({
        err: error,
        token,
      })
    }
  }
}

module.exports = new adminController();
