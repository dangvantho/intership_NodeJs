const express = require("express");
const cors= require('cors')
const airlinesRoute = require("./routes/airlines.route");
const seatRoute = require("./routes/seats.route");
const locationRoute = require("./routes/location.route");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
const session = {
  users: [],
};
app.use((req, res, next) => {
  res.locals.session = session;
  next();
});

app.use("/api/airlines", airlinesRoute);
app.use("/api/seats", seatRoute);
app.use("/api/locations", locationRoute);
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
