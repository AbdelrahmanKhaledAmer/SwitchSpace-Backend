"use strict";

const mongoose = require("mongoose");
const messageSchema = require("./message");

// Define the chat schema
const chatSchema = new mongoose.Schema({
  postOwnerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interestedUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
});

chatSchema.set("versionKey", false);

// Export the chat model
module.exports = mongoose.model("Chat", chatSchema);