"use strict";

const mongoose = require('mongoose');

// Define the category schema
const categorySchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    subcategories: [subcategorySchema]
});

// Define the subcategory schema
const subcategorySchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
});

categorySchema.set('versionKey', false);
subcategorySchema.set('versionKey', false);

// Export the category model
module.exports = mongoose.model('Category', categorySchema);