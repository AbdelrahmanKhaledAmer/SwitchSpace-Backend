"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config");
const UserModel = require("../models/schema/user");
const registerValidator = require("../models/validations/userRegister");
const loginValidator = require("../models/validations/login");

// ********************************************************************************************************* //

// login user in
const login = async (req, res) => {
  // check the password
  const validationVerdict = loginValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }
  let user;
  try {
    // This plugin (softdelete) returns an array
    user = await UserModel.findOne({ email: req.body.email }).isDeleted(false);
    user = user[0];
    // check if the password is valid
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password", token: null });
    }

    // if user is found and password is valid
    // create a token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    return res.status(200).json({ data: { token: token } });
  } catch (err) {
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    } else {
      return res.status(500).json({
        message: "Internal Error",
      });
    }
  }
};

// ********************************************************************************************************* //

// register user into the platform
const register = async (req, res) => {
  // validate the user form
  const validationVerdict = registerValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res
      .status(400)
      .json({ message: validationVerdict.error.details[0].message });
  }
  // create user and assign encrypted password
  let user = Object.assign(req.body, {
    password: bcrypt.hashSync(req.body.password, 10),
  });
  try {
    let retUser = await UserModel.create(user);
    // create a token
    const token = jwt.sign(
      { id: retUser._id, email: retUser.email },
      config.JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    res.status(200).json({ token: token });
  } catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({
        message: "User exists",
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

// log the user out
const logout = (req, res) => {
  res.status(200).json({ data: { token: null } });
};

module.exports = {
  login,
  register,
  logout,
};
