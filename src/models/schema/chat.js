"use strict";

const mongoose = require("mongoose");
const messageSchema = require("./message");

// Define the chat schema
const chatSchema = new mongoose.Schema({
  participantsId: {
    // 1st element in the array is the post owner id
    // 2nd element in the array is the other interested user id
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    required: true,
    validate: {
      validator: (v) => v.length == 2,
      message: "There must be exactly 2 participants in a chat",
    },
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
});

// Export the chat model
module.exports = mongoose.model("Chat", chatSchema);
