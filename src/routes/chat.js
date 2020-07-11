"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const chatController = require("../controllers/chat");

router.get("/unreadMessages", logger, middlewares.checkAuthentication, chatController.getUnreadMessages);
router.get("/:otherUserId", logger, middlewares.checkAuthentication, chatController.getChatHistory);
router.get("/", logger, middlewares.checkAuthentication, chatController.getChatList);

module.exports = router;
