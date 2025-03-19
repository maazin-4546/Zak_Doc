const express = require('express');
const router = express.Router()
const {
    handleRegisterUser,
    handleLoginUser,
    handleGetAllUsers,
    handleForgotPassword,
    handleResetPassword,
    getUserReceipts,
    handleLogoutUser
} = require('../controllers/userController');


router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/logout", handleLogoutUser);
router.get("/all-users", handleGetAllUsers);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);

// get user specific receipt
router.post("/receipts", getUserReceipts);


module.exports = router;