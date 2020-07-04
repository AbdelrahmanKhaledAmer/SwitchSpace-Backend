"use strict";

//const multer = require("multer");
//const upload = multer({ dest: "public/images/postsGallery" });
//const type = upload.array("photos");
//const fs = require("fs");
const Mongoose = require("mongoose");
const s3upload = require("../utils/s3Upload");
const ObjectID = require("bson-objectid");
const PostModel = require("../models/schema/post");
const subcategorySchema = require("../models/schema/subcategory");
const subcategoryModel = Mongoose.model("Subcategory", subcategorySchema);
const PostCreationValidator = require("../models/validations/postCreation");
const PostUpdateValidator = require("../models/validations/postUpdate");
const UserModel = require("../models/schema/user");
const MAX_VIOLATIONS = 3;

// ********************************************************************************************************* //

// cretae a post
const create = async (req, res, next) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a regular user to create a post.",
        });
    }
    req.body.creatorId = req.userId;
    req.body.creatorName = req.userName;
    req.body.itemOwned = JSON.parse(req.body.itemOwned);
    req.body.itemDesired = JSON.parse(req.body.itemDesired);
    req.body.exchangeLocation = JSON.parse(req.body.exchangeLocation);

    // validate the post form
    const validationVerdict = PostCreationValidator.validate(req.body);
    // check whether the form is incomplete
    if (validationVerdict.error) {
        return res.status(400).json({
            message: validationVerdict.error.details[0].message,
        });
    }
    if (
        (req.body.itemOwned.category != "other" && !req.body.itemOwned.subcategory) ||
        (req.body.itemDesired.category != "other" && !req.body.itemDesired.subcategory)
    ) {
        return res.status(400).json({
            message: "Missing subcategory",
        });
    }
    const postId = ObjectID.generate();

    // create post with its complete attributes if the user still has remaining posts
    try {
        let user = await UserModel.findById(req.body.creatorId);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return next();
        } else {
            if (user.remainingPosts == 0) {
                res.status(403).json({
                    message: "User doesn't have sufficient credit to create a post",
                });
                return next();
            }
        }
        if (!req.files) {
            return res.status(400).json({
                message: "Request should have images",
            });
        }

        // wait for upload to be completed
        let images = [];
        const imagePromises = [];
        for (let i = 0; i < req.files.length; i++) {
            imagePromises[i] = s3upload.uploadPhoto(req.files[i].path, "postPics", postId.concat("_").concat(i));
        }
        try {
            images = await Promise.all(imagePromises);
        } catch (err) {
            console.log("upload error");
            console.log(err);
            res.status(500).json({message: "Internal server error"});
            return next();
        }

        let post = Object.assign(req.body, {
            _id: postId,
            photos: images,
        });
        console.log(req.body._id);
        console.log(req.body);
        let createdPost = await PostModel.create(post);
        user.remainingPosts -= 1;
        user.save();
        let subcategory = post.itemDesired.subcategory;
        if (subcategory) {
            // update the trending score of this subcategory
            subcategory = await subcategoryModel.findOne({title: subcategory});
            subcategory.trendingScore += 1;
            subcategory.save();
        }
        res.status(201).json({
            data: createdPost,
        });
        return next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
        });
        return next();
    }
};

// ********************************************************************************************************* //

// view a specific post
const viewPostDetails = async (req, res) => {
    try {
        let post = await PostModel.findById(req.params["id"]).populate("creatorId", "name profilePicture commRate descriptionRate conditionRate");
        if (!post)
            return res.status(404).json({
                message: "Post not found",
            });

        return res.status(200).json({data: post});
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ********************************************************************************************************* //

// update a post
const update = async (req, res, next) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a regular user to edit your post.",
        });
    }

    req.body.creatorId = req.userId;
    req.body.creatorName = req.userName;
    let postId = req.params["id"];
    req.body.postId = postId;
    if (req.body.itemOwned) {
        req.body.itemOwned = JSON.parse(req.body.itemOwned);
        delete req.body.itemOwned._id;
    }
    if (req.body.itemDesired) {
        req.body.itemDesired = JSON.parse(req.body.itemDesired);
        delete req.body.itemDesired._id;
    }
    if (req.body.exchangeLocation) {
        req.body.exchangeLocation = JSON.parse(req.body.exchangeLocation);
        delete req.body.exchangeLocation._id;
    }
    // validate post form
    const validationVerdict = PostUpdateValidator.validate(req.body);
    // check whether the form is incomplete
    if (validationVerdict.error) {
        res.status(400).json({
            message: validationVerdict.error.details[0].message,
        });
        return next();
    }
    // check that there's a post of this onwer
    try {
        let ownerPost = await PostModel.findOne({
            creatorId: req.userId,
            _id: postId,
        });
        if (!ownerPost) {
            res.status(403).json({
                message: "Unauthorized action",
            });
            return next();
        } else {
            if (req.files && req.files.length > 0) {
                // wait for upload to be completed
                let images = [];
                const imagePromises = [];
                for (let i = 0; i < req.files.length; i++) {
                    imagePromises[i] = s3upload.uploadPhoto(req.files[i].path, "postPics", postId.concat("_").concat(i));
                }
                try {
                    images = await Promise.all(imagePromises);
                } catch (err) {
                    res.status(500).json({message: "Internal server error"});
                    return next();
                }
                req.body = Object.assign(req.body, {
                    photos: images,
                });
            }
            // update the trending score of the subcategory
            let subcategory = ownerPost.itemDesired.subcategory;
            if (subcategory) {
                subcategory = await subcategoryModel.findOne({title: subcategory});
                subcategory.trendingScore -= 1;
                subcategory.save();
            }
            let post = await PostModel.findByIdAndUpdate(postId, req.body, {
                new: true,
                runValidators: true,
            });
            subcategory = post.itemDesired.subcategory;
            if (subcategory) {
                subcategory = await subcategoryModel.findOne({title: subcategory});
                subcategory.trendingScore += 1;
                subcategory.save();
            }
            res.status(200).json({
                data: post,
            });
            return next();
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
        return next();
    }
};

// ********************************************************************************************************* //

// delete a post
const remove = async (req, res) => {
    if (!req.params["id"]) {
        return res.status(400).json({
            message: "Cannot delete a post without its ID.",
        });
    }
    // user is deleting the post
    if (req.userId) {
        // check that there's a post of this onwer
        try {
            let ownerPost = await PostModel.findOne({
                creatorId: req.userId,
                _id: req.params["id"],
            });
            if (!ownerPost) {
                return res.status(403).json({
                    message: "Unauthorized action",
                });
            } else {
                let subcategory = ownerPost.itemDesired.subcategory;
                if (subcategory) {
                    subcategory = await subcategoryModel.findOne({title: subcategory});
                    subcategory.trendingScore -= 1;
                    subcategory.save();
                }
                ownerPost.remove();
                return res.status(200).json({
                    message: "Deleted successfully",
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
    // admin is deleting the post
    if (req.adminId) {
        try {
            let post = await PostModel.findOne({_id: req.params["id"]});
            let creatorId = post.creatorId;
            let user = await UserModel.findOne({_id: creatorId});
            if (user) {
                user.violationsCount += 1;
                // user violations exceeded => automatically remove user
                if (user.violationsCount > MAX_VIOLATIONS) {
                    await user.remove();
                }
            }
            await post.remove();
            return res.status(200).json({
                data: {message: "Post deleted successfully"},
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error.",
            });
        }
    }
};

// ********************************************************************************************************* //

// View all posts made by a certain user
const viewAll = async (req, res) => {
    try {
        // userId is retrieved from query parameter instead of request object, to allow other users
        // to view the posts of a user when visiting his/her profile
        let userId = req.query.userId;
        let user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: `No user found with id: ${userId}`,
            });
        }
        let posts = await PostModel.find({creatorId: userId});
        return res.status(200).json({data: posts});
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ********************************************************************************************************* //

// Search all posts regardless of case sensitivity, but is character sensitive
const searchPosts = async (req, res) => {
    // filter attributes
    // default search location is the center of the earth with largest radius possible
    let itemWanted = req.query.iw ? req.query.iw : "";
    let itemOwned = req.query.io ? req.query.io : "";
    let itemWantedCategory = req.query.iwCat ? req.query.iwCat : "";
    let itemWantedSubcategory = req.query.iwSubcat ? req.query.iwSubcat : "";
    let itemOwnedCategory = req.query.ioCat ? req.query.ioCat : "";
    let itemOwnedSubcategory = req.query.ioSubcat ? req.query.ioSubcat : "";
    let itemWantedCondition = req.query.iwCon ? req.query.iwCon : "";
    let itemOwnedCondition = req.query.ioCon ? req.query.ioCon : "";
    let lng = req.query.lng ? req.query.lng : 0;
    let lat = req.query.lat ? req.query.lat : 0;
    // let condition = req.query.condition ? req.query.condition : "";
    let location = {
        type: "Point",
        coordinates: [lng, lat],
    };
    let radius = req.query.radius ? req.query.radius * 1000 : 1e5 * 1000; // convert radius to km
    try {
        let posts = await PostModel.find({
            "itemOwned.title": {
                $regex: itemWanted,
                $options: "i",
            },
            "itemOwned.category": {$regex: itemWantedCategory, $options: "i"},
            "itemOwned.subcategory": {$regex: itemWantedSubcategory, $options: "i"},
            "itemOwned.condition": {$regex: itemWantedCondition, $options: "i"},
            "itemDesired.title": {$regex: itemOwned, $options: "i"},
            "itemDesired.category": {$regex: itemOwnedCategory, $options: "i"},
            "itemDesired.subcategory": {$regex: itemOwnedSubcategory, $options: "i"},
            "itemDesired.condition": {$regex: itemOwnedCondition, $options: "i"},
            exchangeLocation: {
                $geoWithin: {$centerSphere: [location.coordinates, radius / 6371]},
                // $nearSphere: {
                //     $geometry: location,
                //     $maxDistance: radius,
                // },
            },
        });
        return res.status(200).json({
            data: posts,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// ********************************************************************************************************* //

const viewPostsByCategory = async (req, res) => {
    let subcategory = req.query.cat;
    try {
        let posts = await PostModel.find({
            "itemDesired.subcategory": subcategory,
        });
        return res.status(200).json({
            data: posts,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

module.exports = {
    create,
    viewPostDetails,
    update,
    remove,
    viewAll,
    searchPosts,
    viewPostsByCategory,
};
