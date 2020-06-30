"use strict";

const ReportModel = require("../models/schema/report");
const reportValidator = require("../models/validations/report");

// ********************************************************************************************************* //

const reportPost = async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({
            message: "You need to be a regular user to report a post.",
        });
    }
    // Retrieve reporter Id from token
    let reporterId = req.userId;
    // Validate report
    req.body.reporterId = reporterId;
    let valid = reportValidator.validate(req.body);
    // If report is not valid, then user needs to enter valid data.
    if (valid.error) {
        return res.status(400).json({
            message: "Incorrect data. All fields must be available.",
        });
    }
    // Create a report instance and save it in the database
    try {
        // If reporter has already reported a post, don't report again
        let report = await ReportModel.findOne({
            reporterId: reporterId,
            postId: req.body.postId,
        });

        if (report) {
            return res.status(403).json({
                message: "You've reported this post already. It will be reviewed ASAP.",
            });
        }
        // Otherwise write a new report
        report = await ReportModel.create(req.body);
        return res.status(201).json({
            data: report,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ********************************************************************************************************* //

// Get all reports if admin
// TODO: with pagination
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
    if (!req.params.reportId) {
        return res.status(402).json({
            message: "Cannot delete a report without its ID.",
        });
    }
    try {
        await ReportModel.deleteOne({_id: req.params.reportId});
        return res.status(200).json({
            message: "Report deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

module.exports = {
    reportPost,
    viewAllReports,
    deleteReport,
};
