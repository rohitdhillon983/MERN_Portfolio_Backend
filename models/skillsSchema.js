const mongoose  = require("mongoose");

const skillsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:[2,"Name must contain at least 2 characters"],
    },
    proficiency:String,
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
const Skills = mongoose.model("skills",skillsSchema)
module.exports = Skills;