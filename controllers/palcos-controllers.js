const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Palco = require('../models/palcos');

const getPalcoById = async (req, res, next) => {
  const palcoId = req.params.pid;

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
  const stadiumId = req.params.uid;

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

  res.json({ palcos: palcos.map(palco => palco.toObject({ getters: true })) });
};

const createPalco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, level, zone, num_cards, description, price, active, stadium_id, user_id, access, comision} = req.body;

  const createdPalco = new Palco({
    name, level, zone, num_cards, description, price, active, stadium_id, user_id, access, comision
  });

  try {
    await createdPalco.save();
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
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, level, zone, num_cards, description, price, active, stadium_id, user_id, access, comision } = req.body;
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

  palco.name=name;
  palco.level=level;
  palco.zone=zone;
  palco.num_cards=num_cards;
  palco.description=description;
  palco.price=price;
  palco,active=active;
  palco.stadium_id=stadium_id;
  palco.user_id=user_id;
  palco.comision=comision;
  palco.access=access;
  palco.modified_date=Date.now;

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

exports.getPalcoById = getPalcoById;
exports.getPalcoByStadiumId = getPalcoByStadiumId;
exports.createPalco = createPalco;
exports.updatePalco = updatePalco;
exports.deletePalco = deletePalco;
