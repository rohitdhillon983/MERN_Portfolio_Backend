const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Timeline = require("../models/timelineSchema") 

exports.postTimeline = catchAsyncErrors(async(req,res)=>{
    try {
        const {title,description,from,to}= req.body;
        // console.log(" request ",req.body) 
        const newTimeline = await Timeline.create({
            title,description,
            timeline:{from,to}, 
        });
        return res.status(200).json({
            success:true,
            message:"uploade time line successfully",
            newTimeline,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to post the timeline unsuccessfully"
        })
    } 
})

exports.getAllTimelines = catchAsyncErrors(async(req,res)=>{
    try {
        const allTimeLine = await Timeline.find()

        return res.status(200).json({
            success:true,
            message:"get time line successfully",
            allTimeLine
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to get the timeline unsuccessfully"
        })
    }
})

exports.deleteTimeline = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteTimeline = await Timeline.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"delete time line successfully",
            deleteTimeline,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the timeline unsuccessfully"
        })
    }
})