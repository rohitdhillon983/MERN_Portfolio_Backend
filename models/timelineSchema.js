const mongoose  = require("mongoose");

const timelineSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:[2,"Name must contain at least 2 characters"],
    },
    description:{
        type:String,
        required:true,
        minLength:[2,"subject must contain at least 2 characters"],
    },
    timeline:{
        from:String,
        to:String,
    },
})
const Timeline = mongoose.model("Timeline",timelineSchema);
module.exports = Timeline;