const mongoose  = require("mongoose");

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        // required:true,
        minLength:[2,"Name must contain at least 2 characters"],
    },
    description:String,
    projectImg:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    },
    projectLink:String,
    technologies:String,
    gitRepoLink:String,
    stack:String,
    deployed:String,
    projectNo:Number,
})
const Project = mongoose.model("project",projectSchema)
module.exports = Project;