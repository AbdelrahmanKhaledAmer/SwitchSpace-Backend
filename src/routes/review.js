"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const middlewares = require("../middlewares/middlewares");
const reviewController = require("../controllers/review");

router.post(
  "/write",
  logger,
  middlewares.checkAuthentication,
  reviewController.writeReview
);

module.exports = router;
