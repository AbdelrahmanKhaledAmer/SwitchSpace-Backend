"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const reportController = require("../controllers/report");
const postController = require("../controllers/post");

router.get("/report", logger, middlewares.checkAuthentication, reportController.viewAllReports);
router.delete("/report", logger, middlewares.checkAuthentication, reportController.deleteReport);
router.delete("/post", logger, middlewares.checkAuthentication, postController.remove);

module.exports = router;
