"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const reportController = require("../controllers/report");
const postController = require("../controllers/post");

router.get("/report", logger.infoHandler, middlewares.checkAuthentication, reportController.viewAllReports);
router.delete("/report/:reportId", logger.infoHandler, middlewares.checkAuthentication, reportController.deleteReport);
router.delete("/post", logger.infoHandler, middlewares.checkAuthentication, postController.remove);

module.exports = router;
