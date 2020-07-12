"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const chatController = require("../controllers/chat");

router.get("/unreadChats", logger, middlewares.checkAuthentication, chatController.getUnreadChats);
router.get("/:otherUserId", logger, middlewares.checkAuthentication, chatController.getChatHistory);
router.get("/", logger, middlewares.checkAuthentication, chatController.getChatList);

module.exports = router;
