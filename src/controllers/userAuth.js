"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const UserModel = require("../models/schema/user");
const registerValidator = require("../models/validations/userRegister");
const loginValidator = require("../models/validations/login");
const s3upload = require("../utils/s3Upload");
const ObjectID = require("bson-objectid");

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
        user = await UserModel.findOne({email: req.body.email});
        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid Password"});
        }

        // if user is found and password is valid
        // create a token
        const token = jwt.sign({id: user._id, email: user.email, name: user.name}, config.JwtSecret, {
            expiresIn: 86400, // expires in 24 hours
        });

        return res.status(200).json({token: token});
    } catch (err) {
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
const register = async (req, res, next) => {
    // validate the user form
    const validationVerdict = registerValidator.validate(req.body);
    if (validationVerdict.error) {
        res.status(400).json({message: validationVerdict.error.details[0].message});
        return next();
    }
    // generate user id for database usage and image path on aws
    const userID = ObjectID.generate();
    // create user and assign encrypted password
    let user = Object.assign(req.body, {
        _id: userID,
        password: bcrypt.hashSync(req.body.password, 10),
    });
    // check if the user already exists
    try {
        const userExist = await UserModel.findOne({email: user.email});
        if (userExist) {
            res.status(400).json({
                message: "User exists",
            });
            return next();
        }
    } catch (err) {
        console.log("error user exist");
        res.status(500).json({
            message: "Internal server error",
        });
        return next();
    }

    // if profile pic exist
    if (req.file) {
        // generate file name to be stored  in datastore
        const fileName = userID;
        // get current file path
        const filePath = req.file.path;
        // wait for upload to be completed
        let imgObject;
        try {
            imgObject = await s3upload.uploadPhoto(filePath, "profilePics", fileName);
        } catch (err) {
            console.log("upload error");
            console.log(err);
            res.status(500).json({message: "Internal server error"});
            return next();
        }
        req.body.profilePicture = imgObject;
    }

    try {
        let retUser = await UserModel.create(user);
        // create a token
        const token = jwt.sign({id: retUser._id, email: retUser.email, name: retUser.name}, config.JwtSecret, {
            expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).json({token: token});
        return next();
    } catch (err) {
        console.log("error saving user");
        res.status(500).json({
            message: "last save: Internal server error",
        });
        return next();
    }
};

// ********************************************************************************************************* //

// log the user out
const logout = (req, res) => {
    res.status(200).json({message: "logout successful."});
};

module.exports = {
    login,
    register,
    logout,
};
