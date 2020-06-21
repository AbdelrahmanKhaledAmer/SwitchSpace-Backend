const bcrypt = require("bcryptjs");

const UserModel = require("../models/schema/user");
const updateValidator = require("../models/validations/userUpdate");
const s3upload = require("../utils/s3Upload");
// const ObjectID = require("bson-objectid");
// ********************************************************************************************************* //

// update user profile
const updateProfile = async (req, res, next) => {
    if (!req.userId) {
        res.status(403).json({
            message: "You need to be a regular user to update your profile.",
        });
        return next();
    }
    // validate the post form
    const validationVerdict = updateValidator.validate(req.body);
    // check whether the form is incomplete
    if (validationVerdict.error) {
        res.status(400).json({message: validationVerdict.error.details[0].message});
        return next();
    }

    // profile pict upload
    // if profile pic exist
    if (req.file) {
        // generate file name to be stored  in datastore
        const fileName = req.userId;
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
    let user = req.body;

    try {
        if (req.body.password) {
            user = Object.assign(req.body, {
                password: bcrypt.hashSync(req.body.password, 10),
            });
        }

        user = await UserModel.findOneAndUpdate({_id: req.userId}, user, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({data: user});
        return next();
    } catch (err) {
        if (!user) {
            res.status(400).json({message: "user not found"});
            return next();
        }
        res.status(500).json({message: "Internal server error"});
        return next();
    }
};
// ********************************************************************************************************* //

// change current subscription tier of the user.
const userChangeSubscription = async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a regular user to change your subscription tier.",
        });
    }
    if (!req.body.tier) {
        return res.json.status(400).json({message: "missing subscription tier"});
    }
    let user;
    try {
        user = await UserModel.findOneAndUpdate({_id: req.userId}, {tier: req.body.tier}, {new: true, runValidators: true});
        return res.status(200).json({data: user});
    } catch (err) {
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
};

module.exports = {
    updateProfile,
    userChangeSubscription,
};
