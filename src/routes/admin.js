"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const adminController = require("../controllers/admin");
const postController = require("../controllers/post");

router.get(
  "/report",
  logger,
  middlewares.checkAuthentication,
  adminController.viewAllReports
);
router.delete(
  "/report",
  logger,
  middlewares.checkAuthentication,
  adminController.deleteReport
);
router.delete(
  "/post",
  logger,
  middlewares.checkAuthentication,
  postController.remove
);

module.exports = router;
