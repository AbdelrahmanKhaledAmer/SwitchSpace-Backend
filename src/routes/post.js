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

router.post("/", logger, middlewares.checkAuthentication, ImageUploader.multiFileUpload, PostController.create, ImageUploader.deleteTmpFiles);
router.get("/search", logger, PostController.searchPosts);
router.get("/:id", logger, PostController.viewPostDetails);
router.put("/:id", logger, middlewares.checkAuthentication, ImageUploader.multiFileUpload, PostController.update, ImageUploader.deleteTmpFiles);
router.delete("/:id", logger, middlewares.checkAuthentication, PostController.remove);
router.get("/", logger, PostController.viewAll);

module.exports = router;
