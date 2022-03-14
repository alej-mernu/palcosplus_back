const { validationResult } = require('express-validator');
const AWS = require('aws-sdk');

const HttpError = require('../models/http-error');
const Manual = require('../models/manuals');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const getManuals = async (req, res, next) => {
  let manuals;
  try {
    manuals = await Manual.find();
  } catch (err) {
    console.log(Err);
    const error = new HttpError(
      'Something went wrong, could not find a manual.',
      500
    );
    return next(error);
  }

  if (!manuals) {
    const error = new HttpError('Does not exist manuals', 404);
    console.log(error);
    return next(error);
  }

  manuals.forEach((data, idx) => {
    manuals[idx] = data.toObject({ getters: true });
  });

  res.json({ manuals: manuals });
};

const createManual = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  if (!req.file) {
    console.log('Creating manual failed, does not have files');
    return new HttpError('Creating manual failed, does not have files.', 500);
  }
  const location = req.file.location;
  const name = req.file.originalname;

  const createdManual = new Manual({
    name,
    location,
  });

  try {
    const res = await createdManual.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Creating manual failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ manual: createdManual });
};

const downloadManual = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const filename = req.params.filename;
  let file = await s3
    .getObject({ Bucket: bucketName, Key: filename })
    .promise();
  res.send(file.Body);
};

const deleteManual = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const filename = req.params.filename;
  let file = await s3
    .deleteObject({ Bucket: bucketName, Key: filename })
    .promise();
  res.send('File deleted Successfully');
};

exports.getManuals = getManuals;
exports.createManual = createManual;
exports.downloadManual = downloadManual;
exports.deleteManual = deleteManual;
