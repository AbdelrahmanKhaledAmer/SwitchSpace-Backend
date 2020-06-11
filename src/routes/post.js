"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const multer = require("multer");
const upload = multer({ dest: "public/images/postsGallery" });
const type = upload.array("photos");
const middlewares = require("../middlewares/middlewares");
const PostController = require("../controllers/post");

router.post(
  "/create",
  logger,
  middlewares.checkAuthentication,
  type,
  PostController.create
);
router.get(
  "/view",
  logger,
  middlewares.checkAuthentication,
  PostController.ViewPostDetails
);
router.put(
  "/update",
  logger,
  middlewares.checkAuthentication,
  type,
  PostController.update
);
router.delete(
  "/delete",
  logger,
  middlewares.checkAuthentication,
  PostController.remove
);
router.get(
  "/view/all",
  logger,
  middlewares.checkAuthentication,
  PostController.ViewAll
);

module.exports = router;
