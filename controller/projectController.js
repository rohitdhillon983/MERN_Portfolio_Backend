const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Project = require("../models/projectSchema");
const cloudinary = require("cloudinary")

exports.postProject = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {title,projectNo,description,gitRepoLink,projectLink,technologies,stack,deployed}= req.body;
        const {projectImg}= req.files;

        if(!description || !title || !projectNo){
            return next("all files are required")
        }
        const cloudinaryResponseForimage = await cloudinary.uploader.upload(
            projectImg.tempFilePath,{folder:"Project Images"}
        );
        if(!cloudinaryResponseForimage || cloudinaryResponseForimage.error){
            console.error(
                "cloudinary Error:",
                cloudinaryResponseForimage.error || "unknown cloudinary Error" 
            );
        };

        const newProject = await Project.create({
            title,projectNo,description,gitRepoLink,projectLink,technologies,stack,deployed,projectImg:{public_id:cloudinaryResponseForimage.public_id,
                    url:cloudinaryResponseForimage.secure_url,
            } 
        });
        return res.status(200).json({
            success:true,
            message:"uploade Project successfully",
            newProject,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to post the Project unsuccessfully"
        })
    } 
})

exports.getAllProject = catchAsyncErrors(async(req,res)=>{
    try {
        const allProject = await Project.find()

        return res.status(200).json({
            success:true,
            message:"get Project successfully",
            allProject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to get the Project unsuccessfully"
        })
    }
})

exports.deleteProject = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params;
        const findImg = await Project.findById(id);
        const dltimg = findImg.projectImg.public_id;
        await cloudinary.uploader.destroy(dltimg) 
        const deleteProject = await Project.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"delete Project successfully",
            deleteProject,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the Project unsuccessfully"
        })
    }
})

exports.getSingleProject = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params; 
        const deleteProject = await Project.findById(id);
        return res.status(200).json({
            success:true,
            message:"delete Project successfully",
            deleteProject,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the Project unsuccessfully"
        })
    }
})
exports.updateProject = catchAsyncErrors(async(req,res)=>{
    try {
        const {id} = req.params.id;
        const {title,description,gitRepoLink,projectLink,technologies,stack,deployed,projectNo}= req.body;
        const {projectImg}= req.files;
        const project = await Project.findById(req.params.id);
        const projectImageId = project.projectImg.public_id;
        await cloudinary.uploader.destroy(projectImageId);
        const newProjectImage = await cloudinary.uploader.upload(
            projectImg.tempFilePath,
            {
                folder: "Project Images",
            });

        const updateProject = await Project.findByIdAndUpdate(id, { title,description,gitRepoLink,projectLink,technologies,projectNo,stack,deployed,projectImg:{public_id: newProjectImage.public_id,url: newProjectImage.secure_url,} }, { new: true, returnDocument: "after" });
        return res.status(200).json({
            success:true,
            message:"update Project successfully",
            updateProject,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error to delete the Project unsuccessfully"
        })
    }
})