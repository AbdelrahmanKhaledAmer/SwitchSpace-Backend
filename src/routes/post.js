"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

//const multer = require("multer");
// const upload = multer({dest: "public/images/postsGallery"});
// const type = upload.array("photos");
const middlewares = require("../middlewares/middlewares");
const PostController = require("../controllers/post");
// multer for multiple file upload
const ImageUploader = require("../middlewares/ImageUploader");

router.post(
    "/",
    logger.infoHandler,
    middlewares.checkAuthentication,
    ImageUploader.multiFileUpload,
    PostController.create,
    ImageUploader.deleteTmpFiles
);
router.get("/search", logger.infoHandler, PostController.searchPosts);
router.get("/:id", logger.infoHandler, PostController.viewPostDetails);
router.put(
    "/:id",
    logger.infoHandler,
    middlewares.checkAuthentication,
    ImageUploader.multiFileUpload,
    PostController.update,
    ImageUploader.deleteTmpFiles
);
router.delete("/:id", logger.infoHandler, middlewares.checkAuthentication, PostController.remove);
router.get("/", logger.infoHandler, middlewares.checkAuthentication, PostController.viewAll);

module.exports = router;
