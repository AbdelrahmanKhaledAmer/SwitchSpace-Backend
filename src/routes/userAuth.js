"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const UserAuthController = require("../controllers/userAuth");
// multer for single file upload
const ImageUploader = require("../middlewares/ImageUploader");

router.post("/login", logger.infoHandler, UserAuthController.login);
router.post("/register", logger.infoHandler, ImageUploader.singleFileUpload, UserAuthController.register, ImageUploader.deleteTmpFiles);
router.get("/logout", logger.infoHandler, middlewares.checkAuthentication, UserAuthController.logout);

module.exports = router;
