const express = require("express");
const {getAllTimelines,deleteTimeline,postTimeline} = require("../controller/timelineController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/add",isAuthenticated,postTimeline);
router.delete("/delete/:id",isAuthenticated,deleteTimeline) 
router.get("/getall",getAllTimelines) 

module.exports = router;
