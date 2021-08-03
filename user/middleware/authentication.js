const pool = require("../pool");
const md5 = require("md5");
module.exports = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    password = md5(password);
    const data = await pool.query(
      `
           select email, name, id from users where email=$1 and password=$2;
        `,
      [email, password]
    );
    if (data.rows.length !== 1) {
      res.json({ err: "Sai mật khẩu hoặc email" });
      return;
    } else {
      res.locals.user = data.rows[0];
      next();
      return;
    }
  } catch (error) {
    res.json({ err: "Sai mật khẩu hoặc email" });
    return;
  }
};
