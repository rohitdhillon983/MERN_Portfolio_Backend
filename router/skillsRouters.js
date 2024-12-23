const express = require("express");
const {getAllSkills,deleteSkills,postSkills} = require("../controller/skillsController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/add",isAuthenticated,postSkills);
router.delete("/delete/:id",isAuthenticated,deleteSkills) 
router.get("/getall",getAllSkills) 

module.exports = router;
