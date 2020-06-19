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
const UserModel = require("../models/schema/user");
const MAX_VIOLATIONS = 3;

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

  // create post with its complete attributes if the user still has remaining posts
  try {
    let user = await UserModel.findById(req.body.creatorId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      if (user.remainingPosts == 0) {
        return res.status(403).json({
          message: "User doesn't have sufficient credit to create a post",
        });
      }
    }
    let post = await PostModel.create(req.body);
    user.remainingPosts -= 1;
    user.save();
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

    return res.status(200).json({ data: post });
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
      if (subcategory) {
        subcategory = await subcategoryModel.findOne({ title: subcategory });
        subcategory.trendingScore -= 1;
        subcategory.save();
      }
      let post = await PostModel.findByIdAndUpdate(req.headers.id, req.body, {
        new: true,
        runValidators: true,
      });
      subcategory = post.itemDesired.subcategory;
      if (subcategory) {
        subcategory = await subcategoryModel.findOne({ title: subcategory });
        subcategory.trendingScore += 1;
        subcategory.save();
      }
      return res.status(200).json({
        data: post,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// delete a post
const remove = async (req, res) => {
  if (!req.headers.id) {
    return res.status(402).json({
      message: "Cannot delete a post without its ID.",
    });
  }
  // user is deleting the post
  if (req.userId) {
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
        if (subcategory) {
          subcategory = await subcategoryModel.findOne({ title: subcategory });
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
      let post = await PostModel.findOne({ _id: req.headers.id });
      let creatorId = post.creatorId;
      let user = await UserModel.findOne({
        _id: creatorId,
        deleted: false,
      });
      if (user) {
        user.violationsCount += 1;
        // user violations exceeded => automatically remove user
        if (user.violationsCount > MAX_VIOLATIONS) {
          user.deleted = true;
          user.deletedAt = Date.now();
        }
        await user.save();
      }
      await post.remove();
      return res.status(200).json({
        data: { message: "Post deleted successfully" },
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
const ViewAll = async (req, res) => {
  try {
    let posts = await PostModel.find({ creatorId: req.userId });
    if (!posts)
      return res.status(404).json({
        message: "Posts not found",
      });
    return res.status(200).json({ data: posts });
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
