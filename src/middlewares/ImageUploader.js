const multer = require("multer");
const fs = require("fs");
const loggerHandlers = require("../utils/logger/loggerHandlers");

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
const deleteTmpFiles = async function (req) {
    let deletePromises = [];
    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            const filePath = req.files[i].path;
            deletePromises.push(
                fs.unlink(filePath, function (err) {
                    if (err) {
                        loggerHandlers.errorHandler(err);
                    }
                })
            );
        }
    } else if (req.file) {
        const filePath = req.file.path;
        deletePromises.push(
            fs.unlink(filePath, function (err) {
                if (err) {
                    loggerHandlers.errorHandler(err);
                }
            })
        );
    }
    try {
        await Promise.all(deletePromises);
    } catch (err) {
        loggerHandlers.errorHandler(err);
    }
};
// define single file constraints and its attributes
const singleUpload = multer({
    dest: "uploads/profile",
    limits: {fileSize: 2097152, files: 1}, // file size 2mbs,only 1 file is allowed
    fileFilter: imageFilter,
}).single("profilePicture");

const multiUpload = multer({
    dest: "uploads/post",
    limits: {fileSize: 2097152, files: 3}, // file size 2mbs,only 3 file are allowed
    fileFilter: imageFilter,
}).any();

const singleFileUpload = function (req, res, next) {
    singleUpload(req, res, function (err) {
        req.uploadError = err;
        if (err) {
            loggerHandlers.errorHandler(err);
            res.status(400).json({
                message: err.message,
            });
        } else {
            next();
        }
    });
};

const multiFileUpload = function (req, res, next) {
    multiUpload(req, res, function (err) {
        req.uploadError = err;
        if (err) {
            loggerHandlers.errorHandler(err);
            res.status(400).json({
                message: err.message,
            });
        } else {
            next();
        }
    });
};

module.exports = {singleFileUpload, multiFileUpload, deleteTmpFiles};
