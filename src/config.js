"use strict";

// Configuration variables
const port = process.env.PORT || "3000";
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/switch_space";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";
const AWSAccessKeyId = process.env.AWSAccessKeyId;
const AWSSecretKey = process.env.AWSSecretKey;
const STRIPE_PAYMENT = process.env.STRIPE_PAYMENT;
module.exports = {
    port,
    mongoURI,
    JwtSecret,
    AWSAccessKeyId,
    AWSSecretKey,
    STRIPE_PAYMENT,
};
