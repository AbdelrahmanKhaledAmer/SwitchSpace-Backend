"use strict";

const express = require("express");
const router = express.Router();

const middlewares = require("../middlewares");
const reviewController = require("../controllers/review");

// TODO: Change route Names
router.post(
  "/create",
  middlewares.checkAuthentication,
  reviewController.logout
);
router.post(
  "/update",
  middlewares.checkAuthentication,
  reviewController.logout
);

module.exports = router;
