const shortId = require("../config/shortId");
const pool = require("../pool");

class locationController {
  async index(req, res) {
    const { token } = res.locals;
    const data = await pool.query("select * from locations");
    res.json({ data: data.rows, token });
  }
  async get(req, res) {
    const { token } = res.locals;
    const { id } = req.params;
    const data = await pool.query("select * from locations where id=$1", [id]);
    if (data.rowCount === 1) {
      res.json({ data: data.rows[0], token });
    } else {
      res.json({ err: "Không có địa điểm này", token });
    }
  }
  async post(req, res) {
    const { user, token } = res.locals;
    try {
      const { name } = req.body || res.locals.data;
      const data = await pool.query(
        `
                   insert into locations(name) values ($1) returning id,name
                `,
        [name]
      );
      if (data.rowCount === 1) {
        res.json({
          token,
          message: "Thêm địa điểm thành công",
          data: data.rows[0],
        });
      } else {
        res.json({ err: "Thêm địa điểm mới thất bại", token });
      }
    } catch (error) {
      res.json({ err: "Đã tồn tài địa điểm này", token });
    }
  }
  async change(req, res) {
    const { user, token } = res.locals;
    try {
      const { id } = req.params;
      const { name } = req.body || res.locals.data;
      const data = await pool.query(
        `
                  update locations
                  set name=$2 where id=$1
                `,
        [id, name]
      );
      if (data.rowCount === 1) {
        res.json({ token, message: "Update địa điểm thành công" });
      } else {
        res.json({ err: "Không tồn tại địa điểm này", token });
      }
    } catch (error) {
      res.json({ err: "Update địa điểm thất bại", token });
    }
  }
  async delete(req, res) {
    const { token, user } = res.locals;
    const { id } = req.params;
    const data = await pool.query("delete from locations where id=$1", [id]);
    if (data.rowCount === 1) {
      res.json({ token, message: "Xóa địa điểm thành công" });
    } else {
      res.json({ err: "Xóa địa điểm thất bại", token });
    }
  }
}
module.exports = new locationController();
