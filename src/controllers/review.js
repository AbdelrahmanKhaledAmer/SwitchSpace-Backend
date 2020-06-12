"use strict";

const userModel = require("../models/schema/user");
const reviewValidator = require("../models/validations/review");

// ********************************************************************************************************* //

const writeReview = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to review another user.",
    });
  }
  // Retrieve reviewer Id from token and reviewee Id from req.body
  let reviewerId = req.userId;
  let revieweeId = req.body.revieweeId;
  delete req.body.revieweeId;
  // If no reviewer Id exists, then user needs to log in.
  if (!reviewerId) {
    return res.status(403).json({
      message: "Logging in is required for reviewing a user",
    });
  }
  // Validate review
  req.body.reviewerId = reviewerId;
  let valid = reviewValidator.validate(req.body);
  // If review is not valid, then user needs to enter valid data.
  if (valid.error) {
    return res.status(400).json({
      message: "Incorrect data. Ratings must be a value between one and 5.",
    });
  }
  // Retrieve user to be reviewed
  try {
    let reviewee = await userModel.findOne({ _id: revieweeId, deleted: false });
    reviewee = reviewee[0];
    let numReviews = reviewee.reviews.length;
    // If reviewer had already written a review, edit that review
    let review = reviewee.reviews
      .filter((elem) => {
        return elem.reviewerId == reviewerId;
      })
      .pop();
    if (review) {
      // Remove the original review from the array
      reviewee.reviews = reviewee.reviews.filter((elem) => {
        return elem.reviewerId != reviewerId;
      });
      // Edit ratings by adding the new rating and subtracting the old ones
      let commRate = reviewee.commRate * numReviews;
      commRate += req.body.commRate - review.commRate;
      commRate = commRate / numReviews;
      reviewee.commRate = commRate;
      let conditionRate = reviewee.conditionRate * numReviews;
      conditionRate += req.body.conditionRate - review.conditionRate;
      conditionRate = conditionRate / numReviews;
      reviewee.conditionRate = conditionRate;
      let descriptionRate = reviewee.descriptionRate * numReviews;
      descriptionRate += req.body.descriptionRate - review.descriptionRate;
      descriptionRate = descriptionRate / numReviews;
      reviewee.descriptionRate = descriptionRate;
    } else {
      // Edit the ratings by adding the new ratings
      let commRate = reviewee.commRate * numReviews;
      commRate += req.body.commRate;
      commRate = commRate / (numReviews + 1);
      reviewee.commRate = commRate;
      let conditionRate = reviewee.conditionRate * numReviews;
      conditionRate += req.body.conditionRate;
      conditionRate = conditionRate / (numReviews + 1);
      reviewee.conditionRate = conditionRate;
      let descriptionRate = reviewee.descriptionRate * numReviews;
      descriptionRate += req.body.descriptionRate;
      descriptionRate = descriptionRate / (numReviews + 1);
      reviewee.descriptionRate = descriptionRate;
    }
    // Add review to list of reviews
    reviewee.reviews.push(req.body);
    // Save user in database
    reviewee.save();
    return res.status(200).json({
      body: reviewee,
    });
  } catch (err) {
    return res.status(404).json({
      message: "There was an error retrieving user data, try again later.",
    });
  }
};

module.exports = {
  writeReview,
};
