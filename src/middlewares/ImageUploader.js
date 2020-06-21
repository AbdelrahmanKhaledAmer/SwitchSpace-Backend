const multer = require("multer");
const fs = require("fs");

// check images types
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
// delete tmp file if exists
const deleteTmpFile = async function (req) {
  console.log("deleting tmp file");
  if (req.file) {
    const filePath = req.file.path;
    console.log(filePath);
    await fs.unlink(filePath, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
    });
  }
};
// define single file constraints and its attributes
const singleUpload = multer({
  dest: "uploads/profile",
  limits: { fileSize: 5242880, files: 1 }, // file size 5mbs,only 1 file is allowed
  fileFilter: imageFilter,
}).single("profilePicture");

// TODO: construct multiupload here

const singleFileUpload = function (req, res, next) {
  singleUpload(req, res, function (err) {
    req.uploadError = err;
    if (err) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      next();
    }
  });
};

// TODO: do multifile upload here and export it

module.exports = { singleFileUpload, deleteTmpFile };
