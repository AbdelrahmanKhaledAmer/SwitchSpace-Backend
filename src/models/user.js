"use strict";

const mongoose = require('mongoose');

// Define the user schema
const userSchema  = new mongoose.Schema({
    reviews: [reviewSchema],
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // stores the image path on the server
    profilePicture: {
        type: String
    },
    // average rating for user communication
    commRate: {
        type: Number,
        min: 1,
        max: 5
    },
    // average rating for item condition
    conditionRate: {
        type: Number,
        min: 1,
        max: 5
    },
    // average rating for compliance to item description
    descriptionRate: {
        type: Number,
        min: 1,
        max: 5
    },
    tier: {
        type: String,
        enum: ['PerPost', 'LimitedSubscription', 'UnlimitedSubscription'],
        default: 'PerPost'
    },
    violationsCount: Number
});

// Define the review schema
const reviewSchema = new mongoose.Schema({
    reviewerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: String,
    // rating for user communication
    commRate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // rating for item condition
    conditionRate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // rating for compliance to item description
    descriptionRate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

userSchema.set('versionKey', false);
reviewSchema.set('versionKey', false);

// Export the user model
module.exports = mongoose.model('User', userSchema);