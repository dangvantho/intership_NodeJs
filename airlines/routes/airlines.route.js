const express = require("express");
const route = express.Router();
const airlinesController = require("../controllers/airlines.controller");
const authozication = require("../middleware/authozication");
const token = require("../middleware/refreshToken");
const auth_admin= require('../middleware/auth_admin')

route.get("/all", token, airlinesController.index);
route.get("/:id", token, airlinesController.get);
route.post("/", authozication, auth_admin, airlinesController.addAirlines);
route.put("/:id", authozication, auth_admin, airlinesController.changeName);
route.delete("/:id", authozication, auth_admin, airlinesController.delete);

module.exports = route;
