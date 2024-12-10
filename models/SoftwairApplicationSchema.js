const mongoose  = require("mongoose");

const softwairApplicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[2,"Name must contain at least 2 characters"],
    },
    svg:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
})
const SoftwairApplication = mongoose.model("SoftwairApplication",softwairApplicationSchema)
module.exports = SoftwairApplication;