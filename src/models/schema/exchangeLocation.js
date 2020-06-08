"use strict";

const mongoose = require("mongoose");

// Define the exchangeLocation schema
const exchangeLocationSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

exchangeLocationSchema.set("versionKey", false);

// Export the exchangeLocation schema
// exchangeLocation is an embedded document inside the post document
module.exports = exchangeLocationSchema;
