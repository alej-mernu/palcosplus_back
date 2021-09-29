const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

  res.json({ rents: rents.map(rent => rent.toObject({ getters: true })) });
};

const getActiveRents = async (req, res, next) => {
  let rents;
  try {
    rents = await Rent.find({active: true});
  } catch (err) {
    const error = new HttpError(
      'Fetching rents failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ rents: rents.map(rent => rent.toObject({ getters: true })) });
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

  const { name, last_name, email, tel, alias, country, state, city, suburb, postal_code, address, interior_num, palco_id, event_id } = req.body;

  const createdRent = new Rent({
    name, last_name, email, tel, alias, country, state, city, suburb, postal_code, address, interior_num, palco_id, event_id, active: true
  });

  try {
    await createdRent.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Creating rent failed, please try again.',
      500
    );
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

  const { active } = req.body

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
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  res.status(200).json({ rent: rent.toObject({ getters: true }) });
};

exports.getRents = getRents;
exports.getActiveRents = getActiveRents;
exports.getRentsId = getRentsId;
exports.createRent = createRent;
exports.updateRent = updateRent;
