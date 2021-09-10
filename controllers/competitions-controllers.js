const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Competition = require('../models/competition');

const getAllCompetition = async (req, res, next) => {

  let competition;
  try {
    competition = await Competition.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a competition.',
      500
    );
    return next(error);
  }

  if (!competition) {
    const error = new HttpError(
      'Does not exist Competitions',
      404
    );
    return next(error);
  }


  competition.forEach((data, idx) => {
    competition[idx] = data.toObject({ getters: true })
  });

  res.json({ competition: competition });
};

const getCompetitionById = async (req, res, next) => {
  const competitionId = req.params.pid;

  let competition;
  try {
    competition = await Competition.findById(competitionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a competition.',
      500
    );
    return next(error);
  }

  if (!competition) {
    const error = new HttpError(
      'Could not find a competition for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ competition: competition.toObject({ getters: true }) });
};

const createCompetition = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, type, jornadas } = req.body;
  let images = []
  req.files.map(file => {
    images.push(file.path)
  })
  const createdCompetition = new Competition({
    name, type, jornadas, images
  });

  try {
    await createdCompetition.save();
  } catch (err) {
    const error = new HttpError(
      'Creating competition failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ competition: createdCompetition });
};

const updateCompetition = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, type, jornadas } = req.body;
  const competitionId = req.params.pid;

  let competition;
  try {
    competition = await Competition.findById(competitionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update competition.',
      500
    );
    return next(error);
  }

  competition.name = name;
  competition.type = type;
  competition.jornadas = jornadas;
  competition.modified_date = Date.now;

  try {
    await competition.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update competition.',
      500
    );
    return next(error);
  }

  res.status(200).json({ competition: competition.toObject({ getters: true }) });
};

const deleteCompetition = async (req, res, next) => {
  const competitionId = req.params.pid;

  let competition;
  try {
    competition = await Competition.findById(competitionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete competition.',
      500
    );
    return next(error);
  }

  try {
    await competition.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete competition.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted competition.' });
};

exports.getAllCompetition = getAllCompetition;
exports.getCompetitionById = getCompetitionById;
exports.createCompetition = createCompetition;
exports.updateCompetition = updateCompetition;
exports.deleteCompetition = deleteCompetition;
