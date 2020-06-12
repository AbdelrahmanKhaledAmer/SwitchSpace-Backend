const ReportModel = require("../models/schema/report");

// ********************************************************************************************************* //

// Get all reports with pagination
const viewAllReports = async (req, res) => {
  try {
    let reports = ReportModel.find({}).limit(10);
    return res.status(500).json({
      data: reports,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  viewAllReports,
};
