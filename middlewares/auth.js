const {User} = require("../models/userSchema");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {token} = req.cookies || req.cookies.token || req.body.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"user not Authenticated"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decoded)
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
});