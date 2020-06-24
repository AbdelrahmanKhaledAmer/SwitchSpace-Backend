"use strict";

const mongoose = require("mongoose");
const SubcategorySchema = require("../models/schema/subcategory");
const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);
const CategoryModel = require("../models/schema/category");

// ********************************************************************************************************* //

// Returns the top 5 trending subcategories
const getCategories = async (req, res) => {
    try {
        let categories = await CategoryModel.find({});
        return res.status(200).json({
            data: categories,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// ********************************************************************************************************* //

const getSubcategories = async (req, res) => {
    try {
        let subcategories = await SubcategoryModel.find({});
        return res.status(200).json({
            data: subcategories,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

module.exports = {
    getCategories,
    getSubcategories,
};
