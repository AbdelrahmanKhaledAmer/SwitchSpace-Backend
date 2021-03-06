"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const middlewares = require("./middlewares/middlewares");

const userAuth = require("./routes/userAuth");
const adminAuth = require("./routes/adminAuth");
const user = require("./routes/user");
const admin = require("./routes/admin");
const post = require("./routes/post");
const review = require("./routes/review");
const report = require("./routes/report");
const trending = require("./routes/trending");
const chat = require("./routes/chat");
const category = require("./routes/category");

const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));
api.use(middlewares.allowCrossDomain);

// Basic route
api.get("/", (req, res) => {
    res.json({
        name: "Welcome to Switch Space backend",
    });
});

// API routes
api.use("/profile", user);
api.use("/moderate", admin);
api.use("/user/auth", userAuth);
api.use("/admin/auth", adminAuth);
api.use("/post", post);
api.use("/review", review);
api.use("/report", report);
api.use("/trending", trending);
api.use("/chat", chat);
api.use("/category", category);

module.exports = api;
