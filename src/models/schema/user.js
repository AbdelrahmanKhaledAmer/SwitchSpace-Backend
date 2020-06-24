"use strict";

const mongoose = require("mongoose");
const reviewSchema = require("./review");
const emailValidator = require("email-validator");

// Define the user schema
const userSchema = new mongoose.Schema({
    reviews: [reviewSchema],
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => emailValidator.validate(v),
            message: "The email entered is invalid.",
        },
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
    // stores the image as a {url, key} pair on the S3 Object storage
    profilePicture: {
        url: {type: String},
        key: {type: String},
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
    remainingPosts: {
        type: Number,
        default: 0,
    },
    violationsCount: {
        type: Number,
        default: 0,
    },
    subscriptionExpirationDate: {
        type: Date,
        default: Date.now(),
    },
});

// Export the user model
module.exports = mongoose.model("User", userSchema);
