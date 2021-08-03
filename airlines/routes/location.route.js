const express = require("express");
const route = express.Router();
const locationController = require("../controllers/location.controller");
const authozication = require("../middleware/authozication");
const auth_admin= require('../middleware/auth_admin')
const token = require("../middleware/refreshToken");

route.get("/all", token, locationController.index);
route.get("/:id", token, locationController.get);
route.post("/", authozication, auth_admin, locationController.post);
route.put("/:id", authozication, auth_admin , locationController.change);
route.delete("/:id", authozication, auth_admin, locationController.delete);

module.exports = route;
