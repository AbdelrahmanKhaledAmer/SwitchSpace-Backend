"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const middlewares = require("./middlewares");

const auth = require("./routes/auth");
const post = require("./routes/post");

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
api.use("/auth", auth);
api.use("/post", post);


module.exports = api;
