const jwt = require("jsonwebtoken");
const shortId = require("./config/shortId");
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
          let session = {
            id: shortId.generate(),
            data: req.body,
          };
          res.locals.session.users.push(session);
          res.json({ err: "Accesstoken failure", id: session.id });
          return;
        }
        res.locals.user = decode;
        res.locals.token = token({
          name: decode.name,
          email: decode.email,
          id: decode.id,
        });
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
          res.json({ err: "Refreshtoken failure" });
          return;
        }
        const { session_id } = req.headers;
        const { users } = res.locals.session;
        let currentSession;
        res.locals.session.users = users.filter((value) => {
          if (value.id === session_id) currentSession = value;
          return value.id !== session_id;
        });
        if (currentSession) {
          res.locals.data = currentSession.data;
        }
        res.locals.user = decode;
        res.locals.token = token({
          name: decode.name,
          email: decode.email,
          id: decode.id,
        });
        next();
        return;
      }
    );
  } else {
    res.json({ err: "You must login" });
    return;
  }
};
