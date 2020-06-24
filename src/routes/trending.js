"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const categoryController = require("../controllers/category");
const postController = require("../controllers/post");

router.get("/subcategories", logger, categoryController.trendingCategories);
router.get("/posts", logger, postController.viewPostsByCategory);

module.exports = router;
