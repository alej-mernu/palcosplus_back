const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Events = require('../models/events');

const getEventById = async (req, res, next) => {
  const eventId = req.params.pid;

  let event;
  try {
    event = await Events.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a event.',
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError(
      'Could not find a event for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ event: event.toObject({ getters: true }) });
};

const getEventByStadiumId = async (req, res, next) => {
  const stadiumId = req.params.uid;

  let events;
  try {
    events = await Events.find({ stadium_id: stadiumId });
  } catch (err) {
    const error = new HttpError(
      'Fetching palcos failed, please try again later',
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError('Could not find events for the provided user id.', 404)
    );
  }

  res.json({ events: events.map(event => event.toObject({ getters: true })) });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { places, disponibility, type, home, visitor, name, tour_name, date, time, jornada, competition_id, stadium_id } = req.body;

  const createdEvent = new Palco({
    places, disponibility, type, home, visitor, name, tour_name, date, time, jornada, competition_id, stadium_id
  });

  try {
    await createdEvent.save();
  } catch (err) {
    const error = new HttpError(
      'Creating event failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { places, disponibility, type, home, visitor, name, tour_name, date, time, jornada, competition_id, stadium_id } = req.body;
  const eventId = req.params.pid;

  let event;
  try {
    event = await Events.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update event.',
      500
    );
    return next(error);
  }

  event.places = places;
  event.disponibility = disponibility;
  event.type = type;
  event.home = home;
  event.visitor = visitor;
  event.name = name;
  event.tour_name = tour_name;
  event.date = date;
  event.time = time;
  event.jornada = jornada;
  event.competition_id = competition_id;
  event.stadium_id = stadium_id;
  event.modified_date = Date.now;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update event.',
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.pid;

  let event;
  try {
    event = await Events.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete event.',
      500
    );
    return next(error);
  }

  try {
    await event.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete event.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted event.' });
};

exports.getEventById = getEventById;
exports.getEventByStadiumId = getEventByStadiumId;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
