"use strict";

const express = require("express");
const router = express.Router();

const middlewares = require("../middlewares");
const UserAuthController = require("../controllers/userAuth");

router.post("/login", UserAuthController.login);
router.post("/register", UserAuthController.register);
router.get(
  "/logout",
  middlewares.checkAuthentication,
  UserAuthController.logout
);

module.exports = router;
