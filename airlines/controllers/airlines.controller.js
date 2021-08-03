const pool = require("../pool");
const shortId = require("../config/shortId");
class airlinesController {
  // Nhận tất cả hãng bay
  async index(req, res) {
    const { token } = res.locals;
    const data = await pool.query(`select * from airlines`);
    res.json({ data: data.rows, token });
  }
  // Nhận thông tin 1 hãng máy bay mới
  async get(req, res) {
    const { token } = res.locals;
    try {
      const { id } = req.params;
      const data = await pool.query("select * from airlines where id=$1 ", [
        id,
      ]);
      if (data.rowCount === 1) {
        res.json({ data: data.rows[0], token });
      } else {
        res.json({ err: "Không tồn tại hãng máy bay này", token });
      }
    } catch (error) {
      res.json({ err: "Không tồn tại hãng máy bay này", token });
    }
  }
  // Thêm 1 hãng máy bay mới
  async addAirlines(req, res) {
    const { token, user } = res.locals;
    try {
      const { name } = req.body || res.locals.data;
      const data = await pool.query(
        `
                   insert into airlines(name)
                   values ($1) returning id, name
                `,
        [ name]
      );
      res.json({
        token,
        message: "Thêm hãng máy bay thành công",
        data: data.rows[0],
      });
    } catch (error) {
      res.json({ err: "Thêm hãng máy bay thất bại", token });
    }
  }
  // Sửa tên  hãng máy bay
  async changeName(req, res) {
    const { user, token } = res.locals;
    try {
      const { name } = req.body;
      const { id } = req.params;
      let data = await pool.query(
        `
                  update airlines
                  set name=$1 where id=$2
                `,
        [name, id]
      );
      if (data.rowCount === 1) {
        res.json({ token, message: "Update thành công" });
      } else {
        res.json({ err: "Không tồn tại hãng máy bay này" });
      }
    } catch (error) {
      res.json({ err: "Update thất bại", token });
    }
  }
  // Xoa hãng máy bay
  async delete(req, res) {
    const { user, token } = res.locals;
    try {
      const { id } = req.params;
      let data = await pool.query(`delete from airlines where id=$1`, [id]);
      if (data.rowCount === 1) {
        res.json({ token, message: "Delete thành công" });
      } else {
        res.json({ err: "Xóa thất bại", token });
      }
    } catch (error) {
      res.json({ err: "Xóa thất bại", token });
    }
  }
}
module.exports = new airlinesController();
