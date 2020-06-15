"use strict";

const mongoose = require("mongoose");
const itemSchema = require("./item");
const exchangeLocationSchema = require("./exchangeLocation");

// Define the post schema
const postSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemOwned: {
    type: itemSchema,
    required: true,
  },
  itemDesired: {
    type: itemSchema,
    required: true,
  },
  exchangeLocation: {
    type: exchangeLocationSchema,
    required: true,
  },
  // photos of the item owned by the post creator
  photos: {
    type: [String],
    required: true,
  },
});

postSchema.set("timestamps", true);
postSchema.index({ exchangeLocation: "2dsphere" });

// Export the post model
module.exports = mongoose.model("Post", postSchema);
