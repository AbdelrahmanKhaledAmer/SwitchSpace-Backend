"use strict";

const reportSchema = require("../models/schema/report");
const reviewValidator = require("../models/validations/report");

// ********************************************************************************************************* //

const reportPost = async (req, res) => {
  // Retrieve reporter ID from token
  let reporterId = req.userId;
  delete req.body.revieweeId;
  // If no reporter ID exists, then user needs to log in.
  if (!reporterId) {
    return res.status(403).json({
      message: "Logging in is required for reprting a post",
    });
  }
  // Validate report
  req.body.reporterId = reporterId;
  let valid = reviewValidator.validate(req.body);
  // If review is not valid, then user needs to enter valid data.
  if (valid.error) {
    console.log(valid);
    return res.status(400).json({
      message: "Incorrect data. All fields must be available.",
    });
  }
  // Create a report instance and save it in the database
  try {
    // If reporter has already reported a post, don't report again
    await reportSchema.findOne({
      reporterID: reporterId,
      postID: req.body.postId,
    });
    return res.status(403).json({
      message: "You've reported this post already. It will be reviewed ASAP.",
    });
  } catch (err) {
    // Otherwise write a new report
    if (err.code == 1100) {
      try {
        let report = await reportSchema.create(req.body);
        return res.status(200).json({
          data: report,
        });
      } catch (err2) {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  reportPost,
};
