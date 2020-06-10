"use strict";

const userModel = require("../models/schema/user");
const reviewValidator = require("../models/validations/review");

// ********************************************************************************************************* //

const writeReview = async (req, res) => {
  // Retrieve reviewer ID from token
  let reviewerID = req.userID;
  // If no reviewer ID exists, then user needs to log in.
  if (!reviewerID) {
    res.status(403).json({
      message: "Logging in is required for reviewing a user",
    });
    return;
  }
  // Validate review
  req.body.reviewerID = reviewerID;
  let valid = reviewValidator.validate(req.body);
  // If review is not valid, then user needs to enter valid data.
  if (valid.error) {
    res.status(400).json({
      message: "Incorrect data. Ratings must be a value between one and 5.",
    });
    return;
  }
  // Retrieve user to be reviewed
  try {
    let revieweeID = req.body.revieweeID;
    let reviewee = await userModel.findById(revieweeID).exec();
    reviewee.reviews.push(req.body);
    reviewee.save();
  } catch (err) {
    res.status(404).json({
      message: "There was an error retrieving this user, try again later.",
    });
  }
};

module.exports = {
  writeReview,
};
