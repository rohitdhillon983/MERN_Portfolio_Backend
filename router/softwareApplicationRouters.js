const express = require("express");
const {getAllSoftwairApplication,deleteSoftwairApplication,postSoftwairApplication} = require("../controller/softwairApplicationController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/add",isAuthenticated,postSoftwairApplication);
router.delete("/delete/:id",isAuthenticated,deleteSoftwairApplication) 
router.get("/getall",getAllSoftwairApplication) 

module.exports = router;
