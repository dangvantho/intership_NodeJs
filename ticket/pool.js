require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "dangvantho",
  database: "flight_manager",
  host: "localhost",
  port: 5432,
});

module.exports = pool;