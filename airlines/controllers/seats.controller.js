const pool = require("../pool");
const shortId = require("../config/shortId");

class seatController {
  // Lấy thông tin tất cả loại chỗ ngồi
  async index(req, res) {
    const { token } = res.locals;
    try {
      const data = await pool.query("select * from seats");
      res.json({ data: data.rows, token });
    } catch (error) {
      res.json({ err: "Connect đến database bị fail", token });
    }
  }
  // Thêm loại ghế
  async addSeat(req, res) {
    const { user, token } = res.locals;
    try {
      const { name } = req.body || res.locals.data;
      const data = await pool.query(
        `insert into seats(name) values ($1) returning id, name`,
        [name]
      );
      res.json({
        token,
        message: "Thêm loại ghế mới thành công",
        data: data.rows[0],
      });
    } catch (error) {
      res.json({ err: "Thêm loại ghế mới thất bại", token });
    }
  }
  // Lấy thông tin loại chỗ ngồi
  async get(req, res) {
    const { token } = res.locals;
    try {
      const { id } = req.params;
      const data = await pool.query("select * from seats where id=$1", [id]);
      if (data.rowCount === 1) {
        res.json({ data: data.rows[0], token });
      } else {
        res.json({ err: "Không tồn tại loại ghế này", token });
      }
    } catch (error) {
      res.json({ err: "Không tồn tại loại ghế này", token });
    }
  }
  // Sửa tên loại chỗ ngồi
  async change(req, res) {
    const { user, token } = res.locals;
    try {
      const { id } = req.params;
      const { name } = req.body || res.locals.data;
      const data = await pool.query(
        `
                  update seats
                  set name=$2 where id=$1
                `,
        [id, name]
      );
      if (data.rowCount === 1) {
        res.json({ token, message: "Đổi tên loại chỗ ngồi thành công" });
      } else {
        res.json({ err: "Không tồn tại loại ghế này", token });
      }
    } catch (error) {
      res.json({ err: "Đổi tên loại ghế mới thất bại", token });
    }
  }
  // Xóa loại chỗ ngồi
  async delete(req, res) {
    const { user, token } = res.locals;
    try {
      const { id } = req.params;
      const data = await pool.query(`delete from seats where id=$1`, [id]);
      if (data.rowCount === 1) {
        res.json({ token, message: "Xóa loại ghế thành công" });
      } else {
        res.json({ err: "Không tồn tại loại ghế này", token });
      }
    } catch (error) {
      res.json({ err: "Đổi tên loại ghế mới thất bại", token });
    }
  }
}

module.exports = new seatController();
