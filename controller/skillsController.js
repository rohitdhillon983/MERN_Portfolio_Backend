const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Skills = require("../models/skillsSchema");
const cloudinary = require("cloudinary")

exports.postSkills = catchAsyncErrors(async(req,res)=>{
    try {
        const {title,proficiency}= req.body;
        const {svg}= req.files;

        if(!proficiency || !title || !svg){
            return next("all files are required")
        }
        const cloudinaryResponseForimage = await cloudinary.uploader.upload(
            svg.tempFilePath,{folder:"Skills Images"}
        );
        if(!cloudinaryResponseForimage || cloudinaryResponseForimage.error){
            console.error(
                "cloudinary Error:",
                cloudinaryResponseForimage.error || "unknown cloudinary Error" 
            );
        };

        const newSkills = await Skills.create({
            title,proficiency,svg:{public_id:cloudinaryResponseForimage.public_id,
                    url:cloudinaryResponseForimage.secure_url,
            } 
        });
        return res.status(200).json({
            success:true,
            message:"uploade Skills successfully",
            newSkills,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to post the Skills unsuccessfully"
        })
    } 
})

exports.getAllSkills = catchAsyncErrors(async(req,res)=>{
    try {
        const allSkills = await Skills.find()

        return res.status(200).json({
            success:true,
            message:"get Skills successfully",
            allSkills
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to get the Skills unsuccessfully"
        })
    }
})

exports.deleteSkills = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params;
        const findImg = await Skills.findById(id);
        const dltimg = findImg.svg.public_id;
        await cloudinary.uploader.destroy(dltimg) 
        const deleteSkills = await Skills.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"delete Skills successfully",
            deleteSkills,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the Skills unsuccessfully"
        })
    }
})