const { validationResult } = require('express-validator');
const bucketManager = require('../middleware/s3');

const HttpError = require('../models/http-error');
const Palco = require('../models/palcos');

const getAllPalcos = async (req, res, next) => {
  let palcos;
  try {
    palcos = await Palco.find().sort({ name: 1 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the palcos.',
      500
    );
    return next(error);
  }

  if (!palcos) {
    const error = new HttpError('Does not exist the palcos', 404);
    return next(error);
  }

  palcos.forEach((data, idx) => {
    palcos[idx] = data.toObject({ getters: true });
  });

  res.json({ palcos: palcos });
};

const getPalcoById = async (req, res, next) => {
  const palcoId = req.params.id;

  let palco;
  try {
    palco = await Palco.findById(palcoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a palco.',
      500
    );
    return next(error);
  }

  if (!palco) {
    const error = new HttpError(
      'Could not find a palco for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ palco: palco.toObject({ getters: true }) });
};

const getPalcoByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.pid;

  let palcos;
  try {
    palcos = await Palco.find({ stadium_id: stadiumId });
  } catch (err) {
    const error = new HttpError(
      'Fetching palcos failed, please try again later',
      500
    );
    return next(error);
  }

  if (!palcos || palcos.length === 0) {
    return next(
      new HttpError('Could not find palcos for the provided user id.', 404)
    );
  }

  res.json({
    palcos: palcos.map((palco) => palco.toObject({ getters: true })),
  });
};

const getActivePalcoByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.pid;

  let palcos;
  try {
    palcos = await Palco.find({ stadium_id: stadiumId, active: true });
  } catch (err) {
    const error = new HttpError(
      'Fetching palcos failed, please try again later',
      500
    );
    return next(error);
  }

  if (!palcos || palcos.length === 0) {
    return next(
      new HttpError('Could not find palcos for the provided user id.', 404)
    );
  }

  res.json({
    palcos: palcos.map((palco) => palco.toObject({ getters: true })),
  });
};

const createPalco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name,
    type,
    zone,
    access,
    num_cards,
    description,
    price,
    owner_price,
    stadium_id,
    comision,
    user_id,
    isImportant,
    active,
  } = req.body;
  let images = [];

  if (req.files) {
    req.files.map((file) => {
      images.push(file.location);
    });
  }

  const createdPalco = new Palco({
    name,
    type,
    zone,
    access,
    num_cards,
    description,
    price,
    owner_price,
    stadium_id,
    comision,
    active,
    user_id,
    isImportant,
    images,
  });

  try {
    await createdPalco.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Creating palco failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ palco: createdPalco });
};

const updatePalco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name,
    type,
    zone,
    access,
    num_cards,
    description,
    price,
    owner_price,
    stadium_id,
    comision,
    user_id,
    isImportant,
    active,
    imagesName,
  } = req.body;
  const palcoId = req.params.pid;

  let palco;
  try {
    palco = await Palco.findById(palcoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update palco.',
      500
    );
    return next(error);
  }

  const difference = palco.images.filter((x) => !imagesName.includes(x));
  for (let i = 0; i < difference.length; i++) {
    const url = difference[i].split(
      'https://upload-images-palcosplus.s3.amazonaws.com/'
    );
    await bucketManager.deleteBucketFile(url[1]);
  }

  let images = [];
  if (req.files) {
    let file = 0;
    for (let i = 0; i < imagesName.length; i++) {
      if (imagesName[i] === '') {
        images.push(req.files[file].location);
        file++;
      } else {
        images.push(imagesName[i]);
      }
    }
  }

  if (palco) {
    palco.name = name;
    palco.type = type;
    palco.zone = zone;
    palco.access = access;
    palco.num_cards = num_cards;
    palco.description = description;
    palco.price = price;
    palco.owner_price = owner_price;
    palco.stadium_id = stadium_id;
    palco.comision = comision;
    palco.user_id = user_id;
    palco.isImportant = isImportant;
    palco.active = active;
    palco.images = images;
    palco.modified_date = Date.now();
  }

  try {
    await palco.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update palco.',
      500
    );
    return next(error);
  }

  res.status(200).json({ palco: palco.toObject({ getters: true }) });
};

const deletePalco = async (req, res, next) => {
  const palcoId = req.params.pid;

  let palco;
  try {
    palco = await Palco.findById(palcoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete palco.',
      500
    );
    return next(error);
  }

  for (let i = 0; i < palco.images.length; i++) {
    const url = palco.images[i].split(
      'https://upload-images-palcosplus.s3.amazonaws.com/'
    );
    await bucketManager.deleteBucketFile(url[1]);
  }

  try {
    await palco.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete palco.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted palco.' });
};

const deletePalcoByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.id;

  try {
    await Palco.deleteMany({ stadium_id: stadiumId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not delete palco.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted palco.' });
};

exports.getAllPalcos = getAllPalcos;
exports.getPalcoById = getPalcoById;
exports.getPalcoByStadiumId = getPalcoByStadiumId;
exports.getActivePalcoByStadiumId = getActivePalcoByStadiumId;
exports.createPalco = createPalco;
exports.updatePalco = updatePalco;
exports.deletePalco = deletePalco;
exports.deletePalcoByStadiumId = deletePalcoByStadiumId;
