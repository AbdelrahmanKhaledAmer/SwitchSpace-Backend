"use strict";

const mongoose = require("mongoose");

// Define the subcategory schema
const subcategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  trendingScore: {
    type: Number,
    required: true,
    default: 0,
  },
});

subcategorySchema.set("versionKey", false);

// Export the subcategory schema
// subcategory is an embedded document inside the category document
module.exports = subcategorySchema;
