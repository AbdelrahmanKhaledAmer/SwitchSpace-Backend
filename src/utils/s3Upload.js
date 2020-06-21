const fs = require("fs");
const AWS = require("aws-sdk");
const config = require("../config");

// Enter copied or downloaded access id and secret here
const ID = config.AWSAccessKeyId;
const SECRET = config.AWSSecretKey;

const BUCKET_NAME = "switchspace-datastore";
// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

// category should be one of the following ["profilePic", "posts"]
const uploadPhoto = async (filePath, category, fileName) => {
  // read content from the file
  const fileContent = fs.readFileSync(filePath);
  // path of the file on the s3 bucket
  const photoKey = category + "/" + fileName;
  // request parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: photoKey, // file name you want to save as
    Body: fileContent,
    ACL: "public-read",
  };

  // this function throws an exception if the promise is not met
  // returns the URL of the image if all is ok
  const val = await s3.upload(params).promise();
  console.log(val);
  return { url: val.Location, key: val.key };
};
// delete a photo with a certain key: complete path saved in db as key attribute in img file
const deletePhoto = async function (photoKey) {
  const resp = await s3
    .deleteObject({ Key: photoKey, Bucket: BUCKET_NAME })
    .promise();
  return resp;
};

module.exports = { uploadPhoto, deletePhoto };
