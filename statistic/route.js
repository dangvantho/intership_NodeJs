const express= require('express')
const route = express.Router()
const controller= require('./controller')
const authozication= require('./authozication')
const auth_admin = require('./auth_admin')

route.get('/airlines/:id', authozication, auth_admin, controller.airlines)
route.get('/seats/:id', authozication, auth_admin, controller.seats)

module.exports= route