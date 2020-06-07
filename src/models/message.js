"use strict";

const mongoose = require('mongoose');

// Define the message schema
const messageSchema = new mongoose.Schema({
    senderID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

messageSchema.set('versionKey', false);
messageSchema.set('timestamps', true);

// Export the message schema
// message is an embedded document inside the chat document
module.exports = messageSchema;