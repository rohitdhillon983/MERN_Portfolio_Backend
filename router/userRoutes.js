const express = require("express");
const {register, login, logout, getUser, updateProfile, updatePassword, getUserForPortfolio, forgetPassword, resetPasswored, sendotp, OTPVerify} = require("../controller/userController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/otp",isAuthenticated,sendotp);
router.post("/otpSet",OTPVerify)
router.get("/logout",isAuthenticated,logout) /*,isAuthenticated use this */
router.get("/Profile",isAuthenticated,getUser); /*,isAuthenticated use this ----------------error*/
router.put("/update/Profile",isAuthenticated,updateProfile);
router.put("/update/password",isAuthenticated,updatePassword)
router.get("./user/portfolio",getUserForPortfolio);
router.post("/password/forget",forgetPassword)
router.put("/password/reset/:token",resetPasswored)

module.exports = router;
