"use strict";

const mongoose = require("mongoose");

// Define the exchangeLocation schema following GeoJSON Schema
const exchangeLocationSchema = new mongoose.Schema({
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ["Point"], // 'location.type' must be 'Point'
    required: true,
  },
  // Note that longitude comes first in a GeoJSON coordinate array, not latitude
  coordinates: {
    type: [Number],
    required: true,
  },
});

exchangeLocationSchema.set("versionKey", false);

// Export the exchangeLocation schema
// exchangeLocation is an embedded document inside the post document
module.exports = exchangeLocationSchema;
