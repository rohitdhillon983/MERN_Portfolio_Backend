const express = require("express");
const {sendMessage, deleteMessages} = require("../controller/messageController")
const {getAllMessages} = require("../controller/messageController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/getAll",getAllMessages);
router.post("/send",sendMessage);
router.delete("/delete/:id",isAuthenticated,deleteMessages)



module.exports = router;