const ReportModel = require("../models/schema/report");
const PostModel = require("../models/schema/post");

// ********************************************************************************************************* //

// Get all reports with pagination
const viewAllReports = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({
      message: "Only admins can view reports.",
    });
  }
  try {
    let reports = await ReportModel.find({});
    return res.status(200).json({
      data: reports,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ********************************************************************************************************* //

// Delete a report
const deleteReport = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({
      message: "Only admins are allowed to delete reports.",
    });
  }
  if (!req.body.reportId) {
    return res.status(402).json({
      message: "Cannot delete a report without its ID.",
    });
  }
  try {
    await ReportModel.deleteOne({ _id: req.body.reportId });
    return res.status(200).json({
      data: { message: "Report deleted successfully" },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// ********************************************************************************************************* //

// Delete post
const deletePost = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({
      message: "Only admins are allowed to delete posts on this path.",
    });
  }
  if (!req.body.postId) {
    return res.status(402).json({
      message: "Cannot delete a post without its ID.",
    });
  }
  try {
    await PostModel.deleteOne({ _id: req.body.postId });
    return res.status(200).json({
      data: { message: "Post deleted successfully" },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  viewAllReports,
  deleteReport,
  deletePost,
};
