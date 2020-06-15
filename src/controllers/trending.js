"use strict";

const mongoose = require("mongoose");
const SubcategorySchema = require("../models/schema/subcategory");
const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);
const PostModel = require("../models/schema/post");

// ********************************************************************************************************* //

// Returns the top 5 trending subcategories
const trendingCategories = async (req, res) => {
  try {
    let subcategories = await SubcategoryModel.find({})
      .limit(5)
      .sort("-trendingScore");
    return res.status(200).json({
      data: subcategories,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ********************************************************************************************************* //

const viewPostsByCategory = async (req, res) => {
  let subcategory = req.query.cat;
  try {
    let posts = await PostModel.find({
      "itemDesired.subcategory": subcategory,
    });
    return res.status(200).json({
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  trendingCategories,
  viewPostsByCategory,
};
