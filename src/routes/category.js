"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const categoryController = require("../controllers/category");

router.get("/subcategories", logger.infoHandler, categoryController.getSubcategories);
router.get("/", logger.infoHandler, categoryController.getCategories);

module.exports = router;
