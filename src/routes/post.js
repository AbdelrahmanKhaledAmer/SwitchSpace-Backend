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
<<<<<<< HEAD
router.get("/view", PostController.ViewPostDetails);
=======
router.get(
  "/view",
  logger,
  middlewares.checkAuthentication,
  PostController.ViewPostDetails
);
>>>>>>> d373e92ce443d11514d79315c63a500c2592c29d
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
