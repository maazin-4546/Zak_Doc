const express = require('express');
const router = express.Router()
const {
    RegisterUser,
    LoginUser,
    GetAllUsers,
    ForgotPassword,
    ResetPassword,
    getUserReceipts,
    LogoutUser
} = require('../controllers/userController');


router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);
router.get("/all-users", GetAllUsers);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);

// get user specific receipt
router.post("/receipts", getUserReceipts);


module.exports = router;