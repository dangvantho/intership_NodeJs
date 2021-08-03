const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3015;
const cors = require("cors");

const flightRoute = require("./routes/filght.route");
const bookRoute = require("./routes/book.route");
const session = {
  users: [],
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.locals.session = session;
  next();
});

app.use("/api/flights", flightRoute);
app.use("/api/booking", bookRoute);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
