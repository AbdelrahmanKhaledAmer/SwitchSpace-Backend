"use strict";

const mongoose = require("mongoose");

// Define the review schema
const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  // rating for user communication
  commRate: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // rating for item condition
  conditionRate: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // rating for compliance to item description
  descriptionRate: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

reviewSchema.set("versionKey", false);

// Export the review schema
// review is an an embedded document inside the user document
module.exports = reviewSchema;
