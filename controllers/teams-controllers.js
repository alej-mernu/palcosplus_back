const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Team = require('../models/teams');

const getAllTeams = async (req, res, next) => {

  let teams;
  try {
    teams = await Team.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the teams.',
      500
    );
    return next(error);
  }

  if (!teams) {
    const error = new HttpError(
      'Does not exist the teams',
      404
    );
    return next(error);
  }


  teams.forEach((data, idx) => {
    teams[idx] = data.toObject({ getters: true })
  });

  res.json({ teams: teams });
};

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
  const stadiumId = req.params.pid;

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

  const { name, country, stadium_id, principal_color, secundary_color } = req.body;
  let images = []
  if(req.files){
    req.files.map(file => {
      images.push(file.path)
    })
  }

  const createdTeam = new Team({
    name, country, stadium_id, principal_color, secundary_color, images
  });

  try {
    await createdTeam.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Creating team failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ team: createdTeam });
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

  let team;
  try {
    team = await Team.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update team.',
      500
    );
    return next(error);
  }

  if(team){
    team.name = name;
    team.country = country;
    team.stadium_id = stadium_id;
    team.principal_color = principal_color;
    team.secundary_color = secundary_color;
    team.modified_date = Date.now();
  }

  try {
    await team.save();
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

const deleteTeamByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.pid;

  try {
    await Team.deleteMany({ stadium_id: stadiumId });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete team.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Team.' });
};

exports.getAllTeams = getAllTeams;
exports.getTeamById = getTeamById;
exports.getTeamByStadiumId = getTeamByStadiumId;
exports.createTeam = createTeam;
exports.updateTeam = updateTeam;
exports.deleteTeam = deleteTeam;
exports.deleteTeamByStadiumId = deleteTeamByStadiumId;
