const express= require('express')
const route = express.Router()
const adminController= require('../controller/admin.controller')
const authozication = require('../middleware/authozication')
const validate= require('../middleware/validate')
const auth_admin = require('../middleware/auth_admin')

// Login
route.post('/login', validate, adminController.login)
// Thêm admin mới
route.post('/register', validate, authozication, auth_admin, adminController.register)
// Xóa tài khoản admin
route.delete("/:id", authozication, auth_admin, adminController.deleteUser);
// Lấy thông tin toàn bộ admin
route.get('/all', authozication, auth_admin, adminController.getAll)
// Thay đổi mật khẩu
route.put('/change-password', authozication, auth_admin, adminController.changePassword)
// Authozication
route.get('/authozication', authozication, auth_admin, adminController.auth)
//Reset password
route.put('/reset-password', adminController.resetPassword)
//Verify reset password
route.get('/reset-password/verify/:newPassword', adminController.verifyResetPassword)
//Thay đổi thông tin admin
route.put('/change-information', authozication, auth_admin, validate, adminController.changeInformation);

module.exports= route