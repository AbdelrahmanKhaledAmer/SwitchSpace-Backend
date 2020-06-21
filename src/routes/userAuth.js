"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const UserAuthController = require("../controllers/userAuth");
// multer for single file upload
const ImageUploader = require("../middlewares/ImageUploader");

router.post("/login", logger, UserAuthController.login);
router.post("/register", logger, ImageUploader.singleFileUpload, UserAuthController.register, ImageUploader.deleteTmpFile);
router.get("/logout", logger, middlewares.checkAuthentication, UserAuthController.logout);

module.exports = router;
