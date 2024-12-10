const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
// const Experience = require("../models/experienceSchema");
const Experience = require("../models/experienceSchema")

exports.addExperience = catchAsyncErrors(async(req,res)=>{
    try {
        const {jobTitle,description,from,to,companyName}=req.body;
            if (!jobTitle || !description || !from || !companyName) {
                res.json({
                    success:false,
                    message:"All Files are Required!"
                })
            const addExperience = await Experience.create({jobTitle,description,companyName,timeline:{from,to}});
            console.log(addExperience)
            res.status(200).json({
                success:true,
                message:"Add New Experience successfull",
                addExperience
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Add New Experience Failed"
        })
    }
})

exports.getAllExperience = catchAsyncErrors(async(req,res)=>{
    try {

        const getAllExperience = await Experience.find()
        res.status(200).json({
            success:false,
            message:"get All Experience Successfull",
            getAllExperience
        })        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"get All Experience Failed"
        })
    }
})

exports.deleteExperience = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.body.id || req.params;
        if(!id){
            console.log("id is required")
            res.status(500).json({
                success:false,
                message:"All data are required"
            })
        }

        const deleteExperience = await Experience.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:"Delete Experience Failed"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Delete Experience Failed"
        })
    }
})