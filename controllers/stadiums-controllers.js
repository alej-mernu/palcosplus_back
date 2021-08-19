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
    const error = new HttpError(
      'Does not exist stadiums',
      404
    );
    return next(error);
  }

  
  stadium.forEach((data, idx) => {
    stadium[idx] = data.toObject({ getters: true })
  });

  res.json({ stadium: stadium });
};

const getStadiumById = async (req, res, next) => {
  const stadiumId = req.params.pid;

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

  const { name, country, city, address, capacity, fundation_date, local_teams, description, location, fundation, zones, access} = req.body;

  const createdStadium = new Place({
    name, country, city, address, capacity, fundation_date, local_teams, description,location, fundation, zones, access
  });

  try {
    await createdStadium.save();
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

  const { name, country, city, address, capacity, fundation_date, local_teams, description, location, fundation, zones, access } = req.body;
  const stadiumId = req.params.pid;

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

  stadium.name=name;
  stadium.country=country;
  stadium.city=city;
  stadium.address=address;
  stadium.capacity=capacity;
  stadium.fundation_date=fundation_date;
  stadium,local_teams=local_teams;
  stadium.description=description;
  stadium.location=location
  stadium.fundation=fundation;
  stadium.zones=zones;
  stadium.access=access;
  stadium.modified_date=Date.now;

  try {
    await stadium.save();
  } catch (err) {
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
