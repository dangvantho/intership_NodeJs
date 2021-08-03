const express = require("express");
const router = express.Router();

const userController = require("../controller/index.controller");
const authozication = require("../middleware/authozication");
const authentication = require("../middleware/authentication");
const validate = require("../middleware/validate");
const changeInformation = require('../middleware/changeInformation')

// Xem thông tin toàn bộ users(Admin)
router.get("/all", authozication, userController.index);
// Đăng ký tài khoản(Chưa xác nhận)
router.post("/register", validate, userController.register);
// Xác nhạn tạo tài khoản
router.get("/verify/:id", userController.verifyUser);
// Login
router.post("/login", authentication, userController.login);
// Thay đổi password
router.put("/user/password", authozication, userController.chagePassword);
//Reset password
router.put('/reset-password', userController.resetPassword)
//Verify reset password
router.get('/reset-password/verify/:newPassword', userController.verifyResetPassword)
// Delete account (nếu có dữ liệu liên quan đến tk này sẽ không xóa được )

// Authozication cho server
router.get("/authozication", authozication, userController.authozication);
//Thay đổi thông tin người dùng
router.put('/change-information', authozication, changeInformation, userController.changeInformation);
// Lấy thông tin người dùng
router.get("/:id", authozication, userController.getUser);

module.exports = router;
