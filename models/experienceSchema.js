const mongoose = require("mongoose")

const experienceSchema =new mongoose.Schema({
    companyName:{
        type:String,
        require:true
    },
    jobTitle:{
        type:String,
        require:true
    },
    description:{
        type:String,
        required:true,
        minLength:[2,"subject must contain at least 2 characters"],
    },
    timeline:{
        from:String,
        to:String
    }
})
const Experience = mongoose.model("Experience",experienceSchema);
module.exports = Experience;
