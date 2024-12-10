const {User,comparePasswored} = require("../models/userSchema");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { generateToken } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendemail");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken")
require("dotenv").config();
const crypto = require("crypto");
const OTP = require("../models/OtpSchema");
const otpGenerator = require("otp-generator");


exports.register=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files ||Object.keys(req.files).length === 0){
        return next("avtar and resume are required!")
    }
    const {avatar,resume}=req.files;
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,{folder:"PORTFOLIO AVATAR"}
    );
    if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
        console.error(
            "cloudinary Error:",
            cloudinaryResponseForAvatar.error || "unknown cloudinary Error" 
        );
    };

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,{folder:"MY_Resume"}
    );
    if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
        console.error(
            "cloudinary Error:",
            cloudinaryResponseForResume.error || "unknown cloudinary Error" 
        );
    }

    const {linkedinURL,facebookURL,instagramURL,githubURL,portfolioURL,
            password,aboutMe,phone,email,fullName,id} = req.body;

    const user =await User.create({
        linkedinURL,facebookURL,instagramURL,githubURL,portfolioURL,password,aboutMe,phone,email,fullName,id,
        resume:{public_id:cloudinaryResponseForResume.public_id,url:cloudinaryResponseForResume.secure_url}
        ,avatar:{public_id:cloudinaryResponseForAvatar.public_id,url:cloudinaryResponseForAvatar.secure_url},        
    });
    // console.log(user)
    // let payload = {
    //     user:user
    // }
    // generateToken(payload,"user Registered",201,res);
    const token = jwt.sign({email:user.email,id:user._id,accountType:user.accountType,}
        ,process.env.JWT_SECRET_KEY,{
        expiresIn:"2h"
    });
    // user = user.toObject();
    user.token = token;
    user.password=undefined;

    // create cookie and send response
    const options = {expires:new Date(Date.now() + 3*24*60*60*1000),
    httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
    success:true,
    token,
    user,
    message:'logged in Successfully'
    })

});
// ------------------------------------- update profile ------------------------------------------------
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    // get data from user body 
    const newUserData = {fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        portfolioURL: req.body.portfolioURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,};
    
    // upload new cloudinary data and delete old data
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const newProfileImage = await cloudinary.uploader.upload(
          avatar.tempFilePath,
          {
            folder: "PORTFOLIO AVATAR",
          }
        );
        newUserData.avatar = {
          public_id: newProfileImage.public_id,
          url: newProfileImage.secure_url,
        };
      }
    
      if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await User.findById(req.user.id);
        const resumeFileId = user.resume.public_id;
        if (resumeFileId) {
          await cloudinary.uploader.destroy(resumeFileId);
        }
        const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
          folder: "PORTFOLIO RESUME",
        });
        newUserData.resume = {
          public_id: newResume.public_id,
          url: newResume.secure_url,
        };
      }
    
      const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

    // response return
    res.status(200).json({
        success:true,
        message:"profile update successfully",
    })
})
// ------------------------------------- update user Passwored -----------------------------------------
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    // fetch the input data 
    try {
        const {currentPassword,newPassword,confirmPassword}=req.body;
    // console.log(req.user)
    const userDetails = await User.findById(req.user.id).select("+password");

    // validation
    if(!currentPassword || !newPassword || !confirmPassword){
        res.status(400).json({
            success:false,
            message:"Please full all fields",
        })
    }

    //  match the old password
    const oldPassword = await userDetails.comparePasswored(currentPassword);
    if(!oldPassword){
        res.status(400).json({
            success:false,
            message:"Please enter your correct current Passwored",
        })
    }

    if(newPassword !==confirmPassword){
        res.status(400).json({
            success:false,
            message:"Not match, Please enter your correct Passwored",
        })
    }
    userDetails.password = newPassword;
    await userDetails.save();

    res.status(200).json({
        success:true,
        message:"password Change successfully",
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:true,
            message:"password Change unsuccessfully",
        })
    }
})
// --------------------------------------- send and generate otp ----------------------------------
exports.sendotp = async (req, res) => {
	try {
		const  email = req.user.email;
        // console.log("user email id"+req.user.email)

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (!checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `OTP Sending failed User not Found`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};
exports.OTPVerify=catchAsyncErrors(async(req,res)=>{
    const newOTP = req.body

    if(!newOTP){
        return res.status(400).json({
            success:false,
            message:"Please Enter the OTP"
        })
    }
    // const email = User.find()

    console.log(email)
    const response = await OTP.find({email}).sort({createdAt:-1}).limit(1);

    console.log(response)
    if (response.length ===0) {
        return res.status(400).json({
            success:false,
            message:"The OTP is not valid"
        })
    } else if(newOTP !== response[0].otp) {
        return res.status(400).json({
            success:false,
            message:"The OTP is not valid"
        })
    }
    else{
        return res.status(200).json({
            success:true,
            message:"OTP verification Successfull"
        })
    }
})

// -------------------------------------- forget password --------------------------------------------
exports.forgetPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next("user not found")
    }
    const resetToken = user.getResetPassworedToken();
    await user.save({validateBeforeSave:false});
    const resetPassworedUrl = `${process.env.DASHBORD_URL}/password/reset/${resetToken}`;
    const message = `your Reset Passwored Token is :- \n\n ${resetPassworedUrl} \n\n if you've not request for
    this Please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject:"Personal Portfolio Dashboaed recovery Password",
            message,
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPassworedExpire = undefined;
        user.resetPassworedToken = undefined;
        res.status(400).json({
            success:false,
            message:"faile to send email",
        })
    }
    // res.status(200).json({
    //     success:true,
    //     user,
    // })
})

// --------------------------------------- reset passwored ----------------------------------------------
exports.resetPasswored = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.params;
    // console.log(token);
    const resetPassworedToken = crypto
    .createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPassworedToken,resetPassworedExpire:{$gt:Date.now()}, 
    });
    if (!user){
        return next("Reset passwored token is invalid or has been expired")
    };

    if(req.body.password !== req.body.confirmPassword){
        return next("Passwored & confirm passwored Do not Match.")
    }
    user.password = req.body.password;
    user.resetPassworedExpire = undefined;
    user.resetPassworedToken = undefined;
    await user.save();

    const tokens = jwt.sign({email:user.email,id:user._id}
        ,process.env.JWT_SECRET_KEY,{
        expiresIn:"2h"
    });
    // user = user.toObject();
    user.tokens = tokens;
    user.password=undefined;

    // create cookie and send response
    const options = {expires:new Date(Date.now() + 3*24*60*60*1000),
    httpOnly:true,
    }
    res.cookie("token",tokens,options).status(200).json({
    success:true,
    tokens,
    user,
    message:'reset password Successfully'
    })
})

// ------------------------------------- user login -----------------------------------------------------

exports.login = catchAsyncErrors(async(req,res)=>{

    // fetch data from request ke body
    const {email,password} = req.body;

    // validation
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"please fill the Email or password"
        })
    }
    // match user from user Database
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid email or Password"
        })
    }
    // match passwored from user DB
    const isPassworedMatched = await user.comparePasswored(password);
    if(!isPassworedMatched){
        return res.status(400).json({
            success:false,
            message:"Invalid Email or password"
        })
    }
    // let payload = {
    //     email:User.email,
    //     id:User._id,
    // }
    // generateToken(payload,"logged In",200,res)
    const token = jwt.sign({email:user.email,id:user._id}
        ,process.env.JWT_SECRET_KEY,{
        expiresIn:"24h"
    });
    // user = user.toObject();
    user.token = token;
    user.password=undefined;

    // const sendOTP = this.sendotp()
    // create cookie and send response
    const options = {expires:new Date(Date.now() + 3*24*60*60*1000),
    httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
    success:true,
    token,
    user,
    // sendOTP,
    message:'logged in Successfully'
    })
});

// -----------------------------------------user logout------------------------------------
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
        sameSite:"None",
        secure:true
    }).json({
        success:true,
        message:"logout Successfully",
    });
})

// ----------------------------get user ---------------------------
exports.getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({
        success:true,
        user,
    })
})

//  --------------------------- get user for portfolio------------------------------------
exports.getUserForPortfolio = catchAsyncErrors(async(req,res,next)=>{
    const id = "674068d2a83d44c69be824f6";
    const user = await User.findById(id);
    res.status(200).json({
        success:true,
        user,
    })
})



