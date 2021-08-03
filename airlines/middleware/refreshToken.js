const jwt = require("jsonwebtoken");
function token(data) {
  const accesstoken = jwt.sign(data, process.env.ACCESS_SECRET, {
    expiresIn: "600s",
  });
  const refreshtoken = jwt.sign(data, process.env.REFRESH_SECRET, {
    expiresIn: "2h",
  });
  return { accesstoken, refreshtoken };
}
module.exports = async (req, res, next) => {
  const { accesstoken, refreshtoken } = req.headers;
  if (accesstoken) {
    jwt.verify(
      accesstoken.split(" ")[1],
      process.env.ACCESS_SECRET,
      (err, decode) => {
        if (err) {
          next();
          return;
        }
        res.locals.user = decode;
        res.locals.token = token({
          name: decode.name,
          email: decode.email,
          id: decode.id,
        });
        console.log(res.locals.token);
        next();
        return;
      }
    );
  } else if (refreshtoken) {
    jwt.verify(
      refreshtoken.split(" ")[1],
      process.env.REFRESH_SECRET,
      (err, decode) => {
        if (err) {
          next();
          return;
        }
        res.locals.user = decode;
        res.locals.token = token({
          name: decode.name,
          email: decode.email,
          id: decode.id,
        });
        console.log(res.locals.token);
        next();
        return;
      }
    );
  } else {
    next();
    return;
  }
};
