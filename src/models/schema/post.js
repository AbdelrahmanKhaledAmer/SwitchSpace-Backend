"use strict";

const mongoose = require("mongoose");
const itemSchema = require("./item");
const exchangeLocationSchema = require("./exchangeLocation");

// Define the post schema
const postSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    creatorName: {
        type: String,
        required: true,
    },
    itemOwned: {
        type: itemSchema,
        required: true,
    },
    itemDesired: {
        type: itemSchema,
        required: true,
    },
    exchangeLocation: {
        type: exchangeLocationSchema,
        required: true,
    },
    // photos of the item owned by the post creator
    photos: {
        type: [
            {
                url: {type: String},
                key: {type: String},
            },
        ],
        required: true,
        validate: {
            validator: v => v.length > 0 && v.length < 4,
            message: "Post must contain at least one picture and at most 3 pictures.",
        },
    },
});

postSchema.set("timestamps", true);
postSchema.index({exchangeLocation: "2dsphere"});

// Export the post model
module.exports = mongoose.model("Post", postSchema);
