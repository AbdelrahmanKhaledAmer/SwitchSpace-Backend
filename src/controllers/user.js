const bcrypt = require("bcryptjs");

const UserModel = require("../models/schema/user");
const PostModel = require("../models/schema/post");
const updateValidator = require("../models/validations/userUpdate");
const tierChangeValidator = require("../models/validations/tierChange");
const s3upload = require("../utils/s3Upload");
const config = require("../config");
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(config.STRIPE_PAYMENT);
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
        // new token if all succeed
        const token = jwt.sign({id: user._id, email: user.email, name: user.name}, config.JwtSecret, {
            expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).json({token: token, data: user});
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

// change current subscription tier of the user. with a payment
const userChangeSubscription = async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a regular user to change your subscription tier.",
        });
    }
    const validationVerdict = tierChangeValidator.validate(req.body);
    // check whether the form is incomplete
    if (validationVerdict.error) {
        return res.status(400).json({message: validationVerdict.error.details[0].message});
    }

    // payment
    const token = req.body.stripeToken;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    let chargeAmount;
    let expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const tier = req.body.tier;
    let postCnt;
    switch (tier) {
        case "Per Post":
            chargeAmount = 99;
            postCnt = 1;
            expirationDate = Date.now();
            break;
        case "Limited Subscription":
            chargeAmount = 499;
            postCnt = 8;

            break;
        case "Unlimited Subscription":
            chargeAmount = 799;
            postCnt = -1; // checkin create if postcnt==0
            break;
        default:
            postCnt = 0;
    }
    // perform payment
    try {
        await stripe.charges.create({
            amount: chargeAmount,
            currency: "eur",
            description: req.userId + "_" + req.body.tier + "_" + expirationDate + "_" + firstname + "_" + lastname,
            source: token,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({message: "Payment not successful, please try again "});
    }
    let user;
    try {
        user = await UserModel.findOneAndUpdate(
            {_id: req.userId},
            {tier: req.body.tier, remainingPosts: postCnt, subscriptionExpirationDate: expirationDate},
            {new: true, runValidators: true}
        );
        return res.status(200).json({data: user});
    } catch (err) {
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
};

const getUserDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        // find the user excluding his email, password and violationsCount
        // and populate the reviewer in reviews selecting only his name and profilePicture
        const user = await UserModel.findById(userId, "-email -password -violationsCount").populate("reviews.reviewerId", "name profilePicture");
        return res.status(200).json({data: user});
    } catch (err) {
        return res.status(404).json({message: "User not found"});
    }
};

const deactivateAccount = async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a loggedin to deactivate your account",
        });
    }

    let deletedPhotos = [];
    try {
        //get posts
        let posts = await PostModel.find({creatorId: req.userId});
        //put profile picture
        deletedPhotos.push("profilePics/" + req.userId);
        // push pictures for posts
        for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < posts[i].photos.length; j++) {
                deletedPhotos.push(posts[i].photos[j].key);
            }
        }
        await PostModel.deleteMany({creatorId: req.userId});
        // delete user
        await UserModel.deleteOne({_id: req.userId});

        res.status(200).json({
            message: "User deactivated succesfully, Sorry to see you go :( ",
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error, please try again!",
        });
    }

    // delete all photos
    try {
        await s3upload.deletePhotos(deletedPhotos);
    } catch (err) {
        // logger.log
        console.log(err);
    }
};

module.exports = {
    updateProfile,
    userChangeSubscription,
    getUserDetails,
    deactivateAccount,
};
