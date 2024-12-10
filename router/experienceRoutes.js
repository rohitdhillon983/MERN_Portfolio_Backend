const express = require("express")
const { addExperience, getAllExperience, deleteExperience } = require("../controller/experienceController");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router()

router.post("/add",isAuthenticated,addExperience);
router.get("/get",getAllExperience);
router.delete("/delete/:id",isAuthenticated,deleteExperience);

module.exports = router