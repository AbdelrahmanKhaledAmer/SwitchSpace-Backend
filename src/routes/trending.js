"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const trendingController = require("../controllers/trending");

router.get("/subcategories", logger, trendingController.trendingCategories);
router.get("/posts", logger, trendingController.viewPostsByCategory);

module.exports = router;
