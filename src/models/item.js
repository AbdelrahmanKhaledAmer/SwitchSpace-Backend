"use strict";

const mongoose = require('mongoose');

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

itemSchema.set('versionKey', false);

// Export the item schema
// item is an embedded document inside the post document
module.exports = itemSchema;