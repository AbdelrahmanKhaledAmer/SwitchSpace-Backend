"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const UserController = require("../controllers/user");

router.post(
  "/update",
  logger,
  middlewares.checkAuthentication,
  UserController.updateProfile
);
router.post(
  "/subscription",
  logger,
  middlewares.checkAuthentication,
  UserController.userChangeSubscription
);

module.exports = router;
