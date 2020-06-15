"use strict";

const mongoose = require("mongoose");
const messageSchema = require("./message");

// Define the chat schema
const chatSchema = new mongoose.Schema({
  participantsId: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    required: true,
    validate: {
      validator: (v) => {
        return v.length == 2;
      },
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
