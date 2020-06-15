"use strict";

const mongoose = require("mongoose");
const subcategorySchema = require("./subcategory");

// Define the category schema
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [subcategorySchema],
});

// Export the category model
module.exports = mongoose.model("Category", categorySchema);
