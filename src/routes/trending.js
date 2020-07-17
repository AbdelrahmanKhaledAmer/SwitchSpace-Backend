"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const categoryController = require("../controllers/category");
const postController = require("../controllers/post");

router.get("/subcategories", logger.infoHandler, categoryController.trendingCategories);
router.get("/posts", logger.infoHandler, postController.viewPostsByCategory);

module.exports = router;
