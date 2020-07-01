"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");
const middlewares = require("../middlewares/middlewares");
const AdminAuthController = require("../controllers/adminAuth");

router.post("/login", logger, AdminAuthController.login);
router.get("/logout", logger, middlewares.checkAuthentication, AdminAuthController.logout);

module.exports = router;
