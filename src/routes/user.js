"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const middlewares = require("../middlewares/middlewares");
const UserController = require("../controllers/user");
const ImageUploader = require("../middlewares/ImageUploader");

router.put(
    "/update",
    logger,
    middlewares.checkAuthentication,
    ImageUploader.singleFileUpload,
    UserController.updateProfile,
    ImageUploader.deleteTmpFile
);
router.put("/subscription", logger, middlewares.checkAuthentication, UserController.userChangeSubscription);
router.get("/user/", logger, UserController.getUserDetails);

module.exports = router;
