"use strict";

// Configuration variables
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;
const JwtSecret = process.env.JWT_SECRET;
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
