require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 8000
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dbConnection = require("./database/dbConnention");
const messageRouter = require("./router/messageRoutes");
const userRouter = require("./router/userRoutes");
const timelineRouter = require("./router/timelineRouters");
const softwairApplicationRouters = require("./router/softwareApplicationRouters");
const skillsRouter = require("./router/skillsRouters")
const projectRoutes = require("./router/projectRouters")
const experienceRoutes = require("./router/experienceRoutes")

app.use(cors({
    origin:[process.env.PORTFOLIO_URL,process.env.DASHBORD_URL],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}))
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/timeline",timelineRouter);
app.use("/api/v1/SoftwairApplication",softwairApplicationRouters);
app.use("/api/v1/skills",skillsRouter);
app.use("/api/v1/project",projectRoutes);
app.use("/api/v1/experience",experienceRoutes);

app.get("/",(req,res)=>{
    res.send("home Page")
})
dbConnection()
// app.use(errorMiddleware)

app.listen(port,()=>{
    console.log(`connection is setup at ${port}`)
})

module.exports = app