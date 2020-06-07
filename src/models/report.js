"use strict";

const mongoose = require('mongoose');

// Define the report schema
const reportSchema  = new mongoose.Schema({
    reporterID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    complaint: {
        type: String,
        required: true
    }
});

reportSchema.set('versionKey', false);

// Export the report model
module.exports = mongoose.model('Report', reportSchema);