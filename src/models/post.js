"use strict";

const mongoose = require('mongoose');

// Define the post schema
const postSchema  = new mongoose.Schema({
    creatorID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemOwned: {
        type: itemSchema,
        required: true
    },
    itemDesired: {
        type: itemSchema,
        required: true
    },
    exchangeLocation: {
        type: exchangeLocationSchema,
        required: true
    },
    // photos of the item owned by the post creator
    photos: {
        type: [String],
        required: true
    }
});

// Define the item schema
const itemSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Used'],
    },
    modelYear: Date,
    description: String,
    category: {
        type: String,
        required: true
    },
    subcategory: String
});

// Define the exchangeLocation schema
const exchangeLocationSchema = new mongoose.Schema({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

postSchema.set('versionKey', false);
postSchema.set('timestamps', true);
itemSchema.set('versionKey', false);
exchangeLocationSchema.set('versionKey', false);

// Export the post model
module.exports = mongoose.model('Post', postSchema);