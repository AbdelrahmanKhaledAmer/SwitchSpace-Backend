"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const UserAuthController = require("../controllers/userAuth");

router.post("/login", logger, UserAuthController.login);
router.post("/register", logger, UserAuthController.register);
router.get(
  "/logout",
  logger,
  middlewares.checkAuthentication,
  UserAuthController.logout
);

module.exports = router;
