const express= require('express')
const route= express.Router()
const bookController= require('../controllers/booking.controller')
const authozication= require('../middlewares/authozication')
const token= require('../middlewares/refreshToken')
const validateBook = require('../middlewares/validate.book')
const auth_admin = require('../middlewares/auth_admin')
const validateDeleteBook= require('../middlewares/validate.deleteBook')

//Lấy tất cả thông tin vé đã đặt
route.get('/all', authozication, auth_admin, bookController.index)
//Lấy tất cả thông tin vé của người dùng
route.get('/user', authozication, bookController.getAllBookOfUser)
//Thêm vé mới
route.post('/',token, validateBook, bookController.book)
//Lấy thông tin vé chưa xác nhận (admin)
route.get('/not-verify', authozication, auth_admin, bookController.getBookNotVerify)
//Xác nhận vé cho người dùng và gửi email
route.put('/verify/:id', token, bookController.verifyBooking)
//Lấy thông tin của 1 vé 
route.get('/:id', token, bookController.getBook)
//Hủy vé
route.delete('/:id', token, validateDeleteBook, bookController.deleteBook);

module.exports= route