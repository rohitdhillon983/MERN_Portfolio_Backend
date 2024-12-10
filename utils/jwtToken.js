require("dotenv").config();
// const generateToken = require("../models/userSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = (user, message,statusCode,res)=>{
    const token = jwt.sign(user,process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    });;
    res.status(statusCode).cookie("token",token,{
        expires:new Date(Date.now() + process.env.COOKIE_EXPIRES*24*60*60*1000),
        httpOnly:true,
        sameSite:"None",
        secure:true,
    })
    .json({
        success:true,
        message,
        token,
        user,
    });
    
};
