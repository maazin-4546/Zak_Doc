const express = require('express');
const router = express.Router()
const { handleRegisterUser, handleLoginUser, handleGetAllUsers, handleForgotPassword, handleResetPassword } = require('../controllers/userController');


router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.get("/all-users", handleGetAllUsers);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);


module.exports = router;