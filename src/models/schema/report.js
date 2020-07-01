"use strict";

const mongoose = require("mongoose");

// Define the report schema
const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reporterName: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    complaint: {
        type: String,
        required: true,
    },
});

reportSchema.set("timestamps", true);

// Export the report model
module.exports = mongoose.model("Report", reportSchema);
