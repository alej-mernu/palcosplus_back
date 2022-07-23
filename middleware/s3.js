const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/svg+xml': 'svg',
};

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const deleteBucketFile = async (filename) => {
  const params = {
    Bucket: bucketName,
    Key: filename,
  };
  try {
    await s3.headObject(params).promise();
    try {
      await s3.deleteObject(params).promise();
      console.log('file  ' + filename + ' deleted Successfully');
    } catch (err) {
      console.log(
        'ERROR in file ' + filename + ' Deleting : ' + JSON.stringify(err)
      );
      throw new Error('ERROR in file Deleting');
    }
  } catch (err) {
    console.log('File ' + filename + ' not Found ERROR : ' + err);
    throw new Error('File not Found');
  }
};

exports.deleteBucketFile = deleteBucketFile;
