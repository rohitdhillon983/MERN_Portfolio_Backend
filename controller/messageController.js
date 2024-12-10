const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const Message = require("../models/messageSchema");

//---------------------------- store the message in the DB ------------------------------
exports.sendMessage = catchAsyncErrors(async(req,res,next)=>{
    const {senderName,subject,message}=req.body;
    if(!senderName || !subject || !message){
        return next("Please fill full form")
    }
    const data = await Message.create({senderName,subject,message});
    res.status(200).json({
        success:true,
        message:"Message send",
        data,
    })
})

// -------------------get all messages from DB --------------------------------------------------
exports.getAllMessages = catchAsyncErrors(async(req,res,next)=>{
    const message = await Message.find();
    res.status(200).json({
        success:true,
        message,
    
    });
});


// ------------------delete message in the database ----------------------------------------------
exports.deleteMessages = catchAsyncErrors(async(req,res,next)=>{
    const {id}= req.params;
    const messages = await Message.findByIdAndDelete(id);
    if(!messages){
        return next("message Already Deleted!")
    }
    res.status(200).json({
        success:true,
        message:"Message Deleted", 
    });
});