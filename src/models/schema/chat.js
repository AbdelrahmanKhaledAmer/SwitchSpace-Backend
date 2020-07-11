"use strict";

const mongoose = require("mongoose");
const messageSchema = require("./message");

// Define the chat schema
const chatSchema = new mongoose.Schema({
    postOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    interestedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // number of unread messages by post owner
    postOwnerUnread: {
        type: Number,
        default: 0,
    },
    // number of unread messages by the interested user
    interestedUserUnread: {
        type: Number,
        default: 0,
    },
    messages: {
        type: [messageSchema],
        required: true,
    },
});

// Export the chat model
module.exports = mongoose.model("Chat", chatSchema);
