require("dotenv").config();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:[true,"Name Required"]
    },
    email:{
        type:String,
        require:[true,"email Required"]
    },
    phone:{
        type:String,
        require:[true,"Phone no. Required"]
    },
    aboutMe:{
        type:String,
        require:[true,"About me is Required"]
    },
    password:{
        type:String,
        require:[true,"password is Required"],
        mini:[8,"Passwored must contain at least 8 characters!"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            // require:true,
        },
        url:{
            type:String,
            // require:true,
        }
    },
    resume:{
        public_id:{
            type:String,
            // require:true,
        },
        url:{
            type:String,
            // require:true,
        }
    },
    portfolioURL:{
        type:String,
        required:[true,"Portfolio URL is Required"]
    },
    githubURL:{
        type:String,
    },
    instagramURL:{
        type:String,
    },
    facebookURL:{
        type:String,
    },
    linkedinURL:{
        type:String,
    },
    resetPassworedToken:{
        type:String,
    },
    resetPassworedExpire:{
        type:Date,
    }
});

// ---------------hash passwored -----------------------------------------------
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        next();
    }
    
    this.password =await bcrypt.hash(this.password,10);
    // console.log(this.password)
});

// ------------- passwored verification ----------------------------------------
userSchema.methods.comparePasswored = async function (enteredPasswored) {
    return await bcrypt.compare(enteredPasswored,this.password);
};

// -------------- generate JWT -------------------------------------------------
// userSchema.methods.generateToken = async function () {
//     return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
//         expiresIn:process.env.JWT_EXPIRES
//     });
// };

// --------------passwored reset token ------------------------------------------
userSchema.methods.getResetPassworedToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPassworedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPassworedExpire = Date.now()+15*60*1000;
    return resetToken
}

exports.User = mongoose.model("User",userSchema)