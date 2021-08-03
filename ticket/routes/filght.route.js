const express = require("express");
const route = express.Router();
const ticketController = require("../controllers/flight.controller");
const authozication = require("../middlewares/authozication");
const token = require("../middlewares/refreshToken");
const validationTicket = require("../middlewares/validation.addTicket");
const validatePut= require('../middlewares/validate.putTicket')
const filterTicket = require("../middlewares/filter.ticket");
const sort = require("../middlewares/sort.ticket");
const auth_admin = require('../middlewares/auth_admin')

route.get("/all", token, ticketController.index);
route.get("/filter", token, filterTicket, ticketController.filter);
route.get("/sort", token, sort, ticketController.sort);
route.get("/:id", token, ticketController.get);
route.post("/", authozication, auth_admin, validationTicket, ticketController.addTicket);
route.put("/:id", authozication, auth_admin,validatePut, ticketController.put);
route.delete("/:id", authozication, auth_admin, ticketController.delete);

module.exports = route;
