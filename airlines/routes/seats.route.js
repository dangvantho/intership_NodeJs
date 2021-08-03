const express = require("express");
const route = express.Router();
const seatController = require("../controllers/seats.controller");
const authozication = require("../middleware/authozication");
const auth_admin= require('../middleware/auth_admin')
const token = require("../middleware/refreshToken");

route.get("/all", token, seatController.index);
route.get("/:id", token, seatController.get);
route.post("/", authozication, auth_admin, seatController.addSeat);
route.put("/:id", authozication, auth_admin, seatController.change);
route.delete("/:id", authozication, auth_admin, seatController.delete);

module.exports = route;
