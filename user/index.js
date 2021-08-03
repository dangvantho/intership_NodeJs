const express = require("express");
const cors= require('cors')
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3005;

const userRoute = require("./routes/index.route");
const adminRoute= require('./routes/admin.route')
const session = {
  users: [],
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use((req, res, next) => {
  res.locals.session = session;
  next();
});

app.use("/api/users", userRoute);
app.use('/api/admin', adminRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
