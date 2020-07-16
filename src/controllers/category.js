"use strict";

const mongoose = require("mongoose");
const SubcategorySchema = require("../models/schema/subcategory");
const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);
const CategoryModel = require("../models/schema/category");
const loggerHandlers = require("../utils/logger/loggerHandlers")

// ********************************************************************************************************* //

// Returns all categories
const getCategories = async (req, res) => {  
    try {
        let categories = await CategoryModel.find({});
        return res.status(200).json({
            data: categories,
        });
    } catch (err) {
        loggerHandlers.errorHandler(err)
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// ********************************************************************************************************* //

// Returns all subcategories
const getSubcategories = async (req, res) => {
    try {
        let subcategories = await SubcategoryModel.find({});
        return res.status(200).json({
            data: subcategories,
        });
    } catch (err) {
        loggerHandlers.errorHandler(err)
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// ********************************************************************************************************* //

// Returns the top 5 trending subcategories
const trendingCategories = async (req, res) => {
    try {
        let subcategories = await SubcategoryModel.find({}).limit(10).sort("-trendingScore");
        return res.status(200).json({
            data: subcategories,
        });
    } catch (err) {
        loggerHandlers.errorHandler(err)
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

module.exports = {
    getCategories,
    getSubcategories,
    trendingCategories,
};
