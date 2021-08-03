const express = require("express");
const cors= require('cors')
require("dotenv").config();
const route= require('./route')


const app = express();
const PORT = process.env.PORT || 3020;
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const session = {
  users: [],
};
app.use((req, res, next) => {
  res.locals.session = session;
  next();
});

app.use('/api/statistic', route)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
