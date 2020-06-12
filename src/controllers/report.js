"use strict";

const reportSchema = require("../models/schema/report");
const reviewValidator = require("../models/validations/report");

// ********************************************************************************************************* //

const reportPost = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to report a post.",
    });
  }
  // Retrieve reporter Id from token
  let reporterId = req.userId;
  // If no reporter Id exists, then user needs to log in.
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
    return res.status(400).json({
      message: "Incorrect data. All fields must be available.",
    });
  }
  // Create a report instance and save it in the database
  try {
    // If reporter has already reported a post, don't report again
    let report = await reportSchema.findOne({
      reporterId: reporterId,
      postId: req.body.postId,
    });
    // let report = await reportSchema.findOne({});

    if (report) {
      return res.status(403).json({
        message: "You've reported this post already. It will be reviewed ASAP.",
      });
    }
    // Otherwise write a new report
    report = await reportSchema.create(req.body);
    return res.status(200).json({
      data: report,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  reportPost,
};