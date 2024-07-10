const express = require("express");
const protect = require("../middleWare/authMiddleware")
const {sendMessage, allMessages } = require("../controllers/messageControllers")


const router = express.Router();
//console.log(sendMessage)    
 router.route("/").post(protect, sendMessage);
 router.route("/:chatId").get(protect, allMessages);


module.exports = router;