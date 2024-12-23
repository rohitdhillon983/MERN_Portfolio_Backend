const express = require("express");
const {getAllProject,deleteProject,postProject, getSingleProject, updateProject} = require("../controller/projectController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/add",isAuthenticated,postProject);
router.delete("/delete/:id",isAuthenticated,deleteProject);
router.get("/getall",getAllProject) ;
router.get("/getSingleProject/:id",getSingleProject);
router.patch("/update/:id",updateProject);

module.exports = router;
