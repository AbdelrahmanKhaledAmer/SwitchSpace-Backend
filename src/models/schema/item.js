"use strict";

const mongoose = require("mongoose");

// Define the item schema
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
        enum: ["New", "Used"],
    },
    modelYear: {
        type: Number,
        min: 1900,
    },
    description: String,
    category: {
        type: String,
        required: true,
    },
    subcategory: String,
});

// Export the item schema
// item is an embedded document inside the post document
module.exports = itemSchema;
