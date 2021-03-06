const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Rent = require('../models/rents');

const getRents = async (req, res, next) => {
  let rents;
  try {
    rents = await Rent.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching rents failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ rents: rents.map((rent) => rent.toObject({ getters: true })) });
};

const getActiveRents = async (req, res, next) => {
  let rents;
  try {
    rents = await Rent.find({ active: true });
  } catch (err) {
    const error = new HttpError(
      'Fetching rents failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ rents: rents.map((rent) => rent.toObject({ getters: true })) });
};

const getRentsId = async (req, res, next) => {
  const rentId = req.params.id;

  let rent;
  try {
    rent = await Rent.findById(rentId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a rent.',
      500
    );
    return next(error);
  }

  if (!rent) {
    const error = new HttpError(
      'Could not find a rent for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ rent: rent.toObject({ getters: true }) });
};

const createRent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name,
    last_name,
    email,
    tel,
    alias,
    country,
    state,
    city,
    suburb,
    postal_code,
    address,
    interior_num,
    stadium_id,
    palco_id,
    event_id,
    stadium_name,
    palco_name,
    event_name,
    event_date,
    total,
    subtotal,
    comision,
    shipping,
  } = req.body;

  const createdRent = new Rent({
    name,
    last_name,
    email,
    tel,
    alias,
    country,
    state,
    city,
    suburb,
    postal_code,
    address,
    interior_num,
    stadium_id,
    palco_id,
    event_id,
    stadium_name,
    palco_name,
    event_name,
    event_date,
    total,
    subtotal,
    comision,
    shipping,
    active: true,
  });

  try {
    await createdRent.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError('Creating rent failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ rent: createdRent });
};

const updateRent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { active } = req.body;

  const rentId = req.params.id;

  let rent;
  try {
    rent = await Rent.findById(rentId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  rent.active = !active;
  rent.modified_date = Date.now();

  try {
    await rent.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  res.status(200).json({ rent: rent.toObject({ getters: true }) });
};

const deleteRentByPalcoId = async (req, res, next) => {
  const palcoId = req.params.id;

  try {
    await Rent.deleteMany({ palco_id: palcoId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not delete rent.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted rent.' });
};

const deleteRentByEventId = async (req, res, next) => {
  const eventId = req.params.id;

  try {
    await Rent.deleteMany({ event_id: eventId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not delete rent.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted rent.' });
};

const validateRent = async (stadiumId, eventId, palcoId) => {
  let rent;
  try {
    rent = await Rent.find({
      stadium_id: stadiumId,
      event_id: eventId,
      palco_id: palcoId,
    });
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong, could not find a rent.');
  }

  if (rent.length === 0) {
    return true;
  }

  return false;
};

exports.getRents = getRents;
exports.getActiveRents = getActiveRents;
exports.getRentsId = getRentsId;
exports.createRent = createRent;
exports.updateRent = updateRent;
exports.deleteRentByPalcoId = deleteRentByPalcoId;
exports.deleteRentByEventId = deleteRentByEventId;
exports.validateRent = validateRent;
