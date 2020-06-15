"use strict";

const mongoose = require("mongoose");

// Define the message schema
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

messageSchema.set("timestamps", true);

// Export the message schema
// message is an embedded document inside the chat document
module.exports = messageSchema;
