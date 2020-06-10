"use strict";

const express = require("express");
const router = express.Router();

const middlewares = require("../middlewares");
const AdminAuthController = require("../controllers/adminAuth");

router.post("/login", AdminAuthController.login);
router.get(
  "/logout",
  middlewares.checkAuthentication,
  AdminAuthController.logout
);

module.exports = router;
