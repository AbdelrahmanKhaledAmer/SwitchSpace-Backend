"use strict";

const jwt = require("jsonwebtoken");

const config = require("../config");

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.status(200).json(200);
  } else {
    next();
  }
};

const checkAuthentication = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let bearer;
  let token;
  if (req.headers.authorization) {
    // fetch auth type
    bearer = req.headers.authorization.split(" ");
    token = bearer[1];
  }
  // check token exists
  if (!token)
    return res.status(401).json({
      error: "Unauthorized",
      message: "No token provided in the request",
    });
  // check authentication scheme
  if (bearer[0] !== "Bearer") {
    return res.status(401).json({
      error: "unauthorized",
      message: "unauthorized authentication scheme",
    });
  }
  // verifies secret and checks exp
  jwt.verify(token, config.JwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Failed to authenticate token.",
      });
    }
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

// const errorHandler = (err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   res.status(500);
//   res.render("error", { error: err });
// };

module.exports = {
  allowCrossDomain,
  checkAuthentication,
  // errorHandler,
};
