"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const middlewares = require("../middlewares/middlewares");
const reportController = require("../controllers/report");

router.post("/write", logger, middlewares.checkAuthentication, reportController.reportPost);

module.exports = router;
