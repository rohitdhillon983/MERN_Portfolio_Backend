require("dotenv").config()
const mongoose = require("mongoose")

const dbConnection =()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DATABASE CONNECTION SUCCESSFULLY");
    })
    .catch((err)=>{
        console.log("database connection error",err)
    })
}
module.exports = dbConnection;