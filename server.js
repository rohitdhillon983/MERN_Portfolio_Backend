const app =  require("./app.js");
require("dotenv").config()
const cloudinary = require("cloudinary")

// add cloudnary in aur project
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


