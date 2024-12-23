const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const SoftwairApplication = require("../models/SoftwairApplicationSchema");
const cloudinary = require("cloudinary")

exports.postSoftwairApplication = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {name}= req.body;
        const {svg}= req.files;
        // console.log(req.)

        if(!name || !svg){
            return next("all files are required")
        }
        const cloudinaryResponseForimage = await cloudinary.uploader.upload(
            svg.tempFilePath,{folder:"Softwair Application Images"}
        );
        if(!cloudinaryResponseForimage || cloudinaryResponseForimage.error){
            console.error(
                "cloudinary Error:",
                cloudinaryResponseForimage.error || "unknown cloudinary Error" 
            );
        };

        const newSoftwairApplication = await SoftwairApplication.create({
            name,svg:{public_id:cloudinaryResponseForimage.public_id,
                    url:cloudinaryResponseForimage.secure_url,
            } 
        });
        return res.status(200).json({
            success:true,
            message:"uploade Softwair Application successfully",
            newSoftwairApplication,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to post the Softwair Application unsuccessfully"
        })
    } 
})

exports.getAllSoftwairApplication = catchAsyncErrors(async(req,res)=>{
    try {
        const allSoftwairApplication = await SoftwairApplication.find()

        return res.status(200).json({
            success:true,
            message:"get Softwair Application successfully",
            allSoftwairApplication
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to get the Softwair Application unsuccessfully"
        })
    }
})

exports.deleteSoftwairApplication = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params;
        const findImg = await SoftwairApplication.findById(id);
        const dltimg = findImg.svg.public_id;
        await cloudinary.uploader.destroy(dltimg)
        const deleteSoftwairApplication = await SoftwairApplication.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"delete Softwair Application successfully",
            deleteSoftwairApplication,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the Softwair Application unsuccessfully"
        })
    }
})