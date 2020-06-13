"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config");
const adminModel = require("../models/schema/admin");
const loginValidator = require("../models/validations/login");

// ********************************************************************************************************* //

// login Admin in
const login = async (req, res) => {
  // check the password
  const validationVerdict = loginValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }
  let admin;
  try {
    admin = await adminModel.findOne({ email: req.body.email });
    // check if the password is valid
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password", token: null });
    }

    // if user is found and password is valid
    // create a token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      config.JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    return res.status(200).json({ data: { token: token } });
  } catch (err) {
    if (!admin) {
      return res.status(404).json({
        message: "Admin Not Found",
      });
    } else {
      return res.status(500).json({
        message: "Internal Error",
      });
    }
  }
};

// ********************************************************************************************************* //

// log the Admin out
const logout = (req, res) => {
  res.status(200).json({ data: { token: null } });
};

module.exports = {
  login,
  logout,
};
