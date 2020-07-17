"use strict";

// Configuration variables
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;
const JwtSecret = process.env.JWT_SECRET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const STRIPE_PAYMENT = process.env.STRIPE_PAYMENT;
module.exports = {
    port,
    mongoURI,
    JwtSecret,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY,
    STRIPE_PAYMENT,
};
