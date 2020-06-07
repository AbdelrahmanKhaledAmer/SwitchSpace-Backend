"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config");
const UserModel = require("../models/user");
const UserValidator = require("../models/validations/userRegister");

// login user in
const login = (req, res) => {
  // check the password
  if (!Object.prototype.hasOwnProperty.call(req.body, "password")) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });
  }
  // check username
  if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a username property",
    });

  UserModel.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      // check if the password is valid
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) return res.status(401).send({ token: null });

      // if user is found and password is valid
      // create a token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        config.JwtSecret,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );

      res.status(200).json({ token: token });
    })
    .catch((error) =>
      res.status(404).json({
        error: "User Not Found",
        message: error.message,
      })
    );
};

// register user into the platform
const register = (req, res) => {
  // validate the user form
  const validationVerdict = UserValidator.validate(req.body);
  // incomplete form
  if (validationVerdict.error) {
    console.log(validationVerdict.error);
    res.status(400).json(validationVerdict.error.details);
    return;
  }
  // create user and assign encrypted password
  let user = Object.assign(req.body, {
    password: bcrypt.hashSync(req.body.password, 8),
  });

  UserModel.create(user)
    .then((user) => {
      // if user is registered without errors
      // create a token and sign user in automatically
      const token = jwt.sign(
        { id: user._id, username: user.username },
        config.JwtSecret,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );

      res.status(200).json({ token: token });
    })
    .catch((error) => {
      if (error.code == 11000) {
        res.status(400).json({
          error: "User exists",
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    });
};

// log the user out
const logout = (req, res) => {
  res.status(200).send({ token: null });
};

module.exports = {
  login,
  register,
  logout,
};
