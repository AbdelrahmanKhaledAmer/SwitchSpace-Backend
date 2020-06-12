"use strict";

const mongoose = require("mongoose");
const soft_delete = require("mongoose-softdelete");
const reviewSchema = require("./review");

// Define the user schema
const userSchema = new mongoose.Schema({
  reviews: [reviewSchema],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  // stores the image path on the server
  profilePicture: {
    type: String,
  },
  // average rating for user communication
  commRate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  // average rating for item condition
  conditionRate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  // average rating for compliance to item description
  descriptionRate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  tier: {
    type: String,
    enum: ["PerPost", "LimitedSubscription", "UnlimitedSubscription"],
    default: "PerPost",
  },
  violationsCount: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(soft_delete);

userSchema.set("versionKey", false);

// Export the user model
module.exports = mongoose.model("User", userSchema);
