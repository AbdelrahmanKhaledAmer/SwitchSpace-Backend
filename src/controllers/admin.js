const ReportModel = require("../models/schema/report");

// ********************************************************************************************************* //

// Get all reports with pagination
const viewAllReports = async (req, res) => {
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

module.exports = {
  viewAllReports,
  deleteReport,
};
