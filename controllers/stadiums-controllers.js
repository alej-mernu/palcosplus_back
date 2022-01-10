const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Stadium = require('../models/stadium');

const getAllStadiums = async (req, res, next) => {
  let stadium;
  try {
    stadium = await Stadium.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a stadium.',
      500
    );
    return next(error);
  }

  if (!stadium) {
    const error = new HttpError('Does not exist stadiums', 404);
    return next(error);
  }

  stadium.forEach((data, idx) => {
    stadium[idx] = data.toObject({ getters: true });
  });

  res.json({ stadium: stadium });
};

const getStadiumById = async (req, res, next) => {
  const stadiumId = req.params.id;

  let stadium;
  try {
    stadium = await Stadium.findById(stadiumId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a stadium.',
      500
    );
    return next(error);
  }

  if (!stadium) {
    const error = new HttpError(
      'Could not find a stadium for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ stadium: stadium.toObject({ getters: true }) });
};

const createStadium = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name,
    country,
    city,
    capacity,
    fundation_date,
    local_teams,
    description,
    location,
    zones,
    delivery_zone,
    access,
  } = req.body;

  let images = [];
  if (req.files) {
    req.files.map((file) => {
      images.push(file.location);
    });
  }

  const createdStadium = new Stadium({
    name,
    country,
    city,
    capacity,
    fundation_date,
    local_teams,
    description,
    location,
    zones,
    delivery_zone,
    access,
    images,
  });

  try {
    const res = await createdStadium.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Creating stadium failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ stadium: createdStadium });
};

const updateStadium = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name,
    country,
    city,
    capacity,
    fundation_date,
    local_teams,
    description,
    location,
    zones,
    delivery_zone,
    access,
    imagesName,
  } = req.body;
  const stadiumId = req.params.pid;

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

  let stadium;
  try {
    stadium = await Stadium.findById(stadiumId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update stadium.',
      500
    );
    return next(error);
  }

  if (stadium) {
    stadium.name = name;
    stadium.country = country;
    stadium.city = city;
    stadium.capacity = capacity;
    stadium.fundation_date = fundation_date;
    stadium.local_teams = local_teams;
    stadium.description = description;
    stadium.location = location;
    stadium.delivery_zone = delivery_zone;
    stadium.zones = zones;
    stadium.access = access;
    stadium.images = images;
    stadium.modified_date = Date.now();
  }

  try {
    await stadium.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not update stadium.',
      500
    );
    return next(error);
  }

  res.status(200).json({ stadium: stadium.toObject({ getters: true }) });
};

const deleteStadium = async (req, res, next) => {
  const stadiumId = req.params.pid;

  let stadium;
  try {
    stadium = await Stadium.findById(stadiumId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete stadium.',
      500
    );
    return next(error);
  }

  try {
    await stadium.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete stadium.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted stadium.' });
};

exports.getAllStadiums = getAllStadiums;
exports.getStadiumById = getStadiumById;
exports.createStadium = createStadium;
exports.updateStadium = updateStadium;
exports.deleteStadium = deleteStadium;
