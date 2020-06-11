"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const middlewares = require("./middlewares/middlewares");

const userAuth = require("./routes/userAuth");
const adminAuth = require("./routes/adminAuth");
const post = require("./routes/post");
const review = require("./routes/review");

const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);

// Basic route
api.get("/", (req, res) => {
  res.json({
    name: "Welcome to Switch Space backend",
  });
});

// API routes
api.use("/user/auth", userAuth);
api.use("/admin/auth", adminAuth);
api.use("/post", post);
api.use("/review", review);

module.exports = api;
