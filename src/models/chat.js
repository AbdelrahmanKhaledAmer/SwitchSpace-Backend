"use strict";

const mongoose = require('mongoose');

// Define the chat schema
const chatSchema  = new mongoose.Schema({
    postOwnerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interestedUserID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: {
        type: [messageSchema],
        required: true
    }
});

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

chatSchema.set('versionKey', false);
messageSchema.set('versionKey', false);
messageSchema.set('timestamps', true);

// Export the chat model
module.exports = mongoose.model('Chat', chatSchema);