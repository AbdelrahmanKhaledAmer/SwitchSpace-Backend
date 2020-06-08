"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config");
const UserModel = require("../models/schema/user");
const UserValidator = require("../models/validations/userRegister");

// ********************************************************************************************************* //

// login user in
const login = async (req, res) => {
  // TODO add signin with email
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

  try {
    let user = UserModel.findOne({ username: req.body.username }).exec();
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

    return res.status(200).json({ token: token });
  } catch (err) {
    return res.status(404).json({
      error: "User Not Found",
      message: err.message,
    });
  }
};

// ********************************************************************************************************* //

// register user into the platform
const register = async (req, res) => {
  // validate the user form
  const validationVerdict = UserValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    console.log(validationVerdict.error);
    return res.status(400).json(validationVerdict.error.details);
  }
  // create user and assign encrypted password
  let user = Object.assign(req.body, {
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    let retUser = await UserModel.create(user);
    // create a token
    const token = jwt.sign(
      { id: retUser._id, username: retUser.username },
      config.JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    res.status(200).json({ token: token });
  } catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({
        error: "User exists",
        message: err.message,
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        message: err.message,
      });
    }
  }
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
