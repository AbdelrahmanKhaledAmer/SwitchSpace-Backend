"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middlewares/loggerHandler");
const categoryController = require("../controllers/category");

router.get("/subcategories", logger, categoryController.getSubcategories);
router.get("/", logger, categoryController.getCategories);

module.exports = router;
