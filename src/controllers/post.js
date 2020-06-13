"use strict";

//const multer = require("multer");
//const upload = multer({ dest: "public/images/postsGallery" });
//const type = upload.array("photos");
//const fs = require("fs");
const Mongoose = require("mongoose");
const PostModel = require("../models/schema/post");
const subcategorySchema = require("../models/schema/subcategory");
const subcategoryModel = Mongoose.model("Subcategory", subcategorySchema);
const PostValidator = require("../models/validations/post");

// ********************************************************************************************************* //

// cretae a post
const create = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to create a post.",
    });
  }
  req.body.creatorId = req.userId;
  // validate the post form
  const validationVerdict = PostValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }

  // create post with its complete attributes
  try {
    let post = await PostModel.create(req.body);
    let subcategory = post.itemDesired.subcategory;
    if (subcategory) {
      // update the trending score of this subcategory
      subcategory = await subcategoryModel.findOne({ title: subcategory });
      subcategory.trendingScore += 1;
      subcategory.save();
    }
    return res.status(201).json({
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// view a specific post
const ViewPostDetails = async (req, res) => {
  try {
    let post = await PostModel.findById(req.headers.id);
    if (!post)
      return res.status(404).json({
        message: "Post not found",
      });

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// update a post
const update = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to edit your post.",
    });
  }
  req.body.creatorId = req.userId;
  // validate post form
  const validationVerdict = PostValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }
  // check that there's a post of this onwer
  try {
    let ownerPost = await PostModel.findOne({
      creatorId: req.userId,
      _id: req.headers.id,
    });
    if (!ownerPost) {
      return res.status(403).json({
        message: "Unauthorized action",
      });
    } else {
      // update the trending score of the subcategory
      let subcategory = ownerPost.itemDesired.subcategory;
      subcategory = await subcategoryModel.findOne({ title: subcategory });
      subcategory.trendingScore -= 1;
      subcategory.save();
      let post = await PostModel.findByIdAndUpdate(req.headers.id, req.body, {
        new: true,
        runValidators: true,
      });
      subcategory = post.itemDesired.subcategory;
      subcategory = await subcategoryModel.findOne({ title: subcategory });
      subcategory.trendingScore += 1;
      subcategory.save();
      return res.status(200).json({
        data: post,
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// delete a post
const remove = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to delete your post.",
    });
  }
  // check that there's a post of this onwer
  try {
    let ownerPost = await PostModel.findOne({
      creatorId: req.userId,
      _id: req.headers.id,
    });
    if (!ownerPost) {
      return res.status(403).json({
        message: "Unauthorized action",
      });
    } else {
      let subcategory = ownerPost.itemDesired.subcategory;
      subcategory = await subcategoryModel.findOne({ title: subcategory });
      subcategory.trendingScore -= 1;
      subcategory.save();
      ownerPost.remove();
      // await PostModel.findByIdAndRemove(req.headers.id);
      return res.status(200).json({
        message: "Deleted successfully",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

const ViewAll = async (req, res) => {
  try {
    let posts = await PostModel.find({ creatorId: req.userId });
    if (!posts)
      return res.status(404).json({
        message: "Posts not found",
      });
    return res.status(200).json(posts);
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
  let itemOwnedCategory = req.query.ioCat ? req.query.ioCat : "";
  let lon = req.query.lon ? req.query.lon : 0;
  let lat = req.query.lat ? req.query.lat : 0;
  let location = {
    type: "Point",
    coordinates: [lon, lat],
  };
  let radius = req.query.radius ? req.query.radius : 1e5 * 1000; // convert radius to km
  // let lon = req.query.lon ? req.query.lon : "";
  // let lat = req.query.lat ? req.query.lat : "";
  try {
    let posts = await PostModel.find({
      "itemOwned.title": {
        $regex: itemWanted,
        $options: "i",
      },
      "itemOwned.category": { $regex: itemWantedCategory, $options: "i" },
      "itemDesired.title": { $regex: itemOwned, $options: "i" },
      "itemDesired.category": { $regex: itemOwnedCategory, $options: "i" },
      exchangeLocation: {
        $nearSphere: {
          $geometry: location,
          $maxDistance: radius,
        },
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

module.exports = {
  create,
  ViewPostDetails,
  update,
  remove,
  ViewAll,
  searchPosts,
};
