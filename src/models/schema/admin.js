"use strict";

const mongoose = require("mongoose");

// Define the admin schema
const adminSchema = new mongoose.Schema({
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
  },
});

// Export the admin model
module.exports = mongoose.model("Admin", adminSchema);
