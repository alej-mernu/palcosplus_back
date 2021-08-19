const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Team = require('../models/teams');

const getTeamById = async (req, res, next) => {
  const teamId = req.params.pid;

  let team;
  try {
    team = await Team.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a team.',
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      'Could not find a team for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ team: team.toObject({ getters: true }) });
};

const getTeamByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.uid;

  let teams;
  try {
    teams = await Team.find({ stadium_id: stadiumId });
  } catch (err) {
    const error = new HttpError(
      'Fetching teams failed, please try again later',
      500
    );
    return next(error);
  }

  if (!teams || teams.length === 0) {
    return next(
      new HttpError('Could not find teams for the provided user id.', 404)
    );
  }

  res.json({ teams: teams.map(team => team.toObject({ getters: true })) });
};

const createTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, country, stadium_id, principal_color, secundary_color} = req.body;

  const createdTeam = new Palco({
    name, country, stadium_id, principal_color, secundary_color
  });

  try {
    await createdTeam.save();
  } catch (err) {
    const error = new HttpError(
      'Creating palco failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ palco: createdTeam });
};

const updateTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, country, stadium_id, principal_color, secundary_color } = req.body;
  const teamId = req.params.pid;

  let palco;
  try {
    palco = await Palco.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  team.name=name;
  team.country=country;
  team.stadium_id=stadium_id;
  team.principal_color=principal_color;
  team.secundary_color=secundary_color;
  palco.modified_date=Date.now;

  try {
    await palco.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  res.status(200).json({ team: team.toObject({ getters: true }) });
};

const deleteTeam = async (req, res, next) => {
  const teamId = req.params.pid;

  let team;
  try {
    team = await Team.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete team.',
      500
    );
    return next(error);
  }

  try {
    await team.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete team.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted palco.' });
};

exports.getTeamById = getTeamById;
exports.getTeamByStadiumId = getTeamByStadiumId;
exports.createTeam = createTeam;
exports.updateTeam = updateTeam;
exports.deleteTeam = deleteTeam;
