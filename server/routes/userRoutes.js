const express = require('express');
const router = express.Router()
const {
    RegisterUser,
    LoginUser,
    GetSingleUser,
    ForgotPassword,
    ResetPassword,
    getUserReceipts,
    LogoutUser,
    updateUserInfo,
    updateUserPassword
} = require('../controllers/userController');


router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);
router.get("/single-user/:id", GetSingleUser);
router.put("/update-user/:id", updateUserInfo);
router.put("/update-user-password/:id", updateUserPassword);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);

// get user specific receipt
router.post("/receipts", getUserReceipts);


module.exports = router;