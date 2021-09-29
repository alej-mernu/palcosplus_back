const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Events = require('../models/events');

const getAllEvents = async (req, res, next) => {

  let events;
  try {
    events = await Events.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a event.',
      500
    );
    return next(error);
  }

  if (!events) {
    const error = new HttpError(
      'Does not exist events',
      404
    );
    return next(error);
  }


  events.forEach((data, idx) => {
    events[idx] = data.toObject({ getters: true })
  });

  res.json({ events: events });
};

const getEventById = async (req, res, next) => {
  const eventId = req.params.id;

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

  const { type, home, visitor, name, tour_name, event_color, date, time, jornada, competition_id, stadium_id, isImportant } = req.body;
  let images = []
  if(req.files){
    req.files.map(file => {
      images.push(file.path)
    })
  }

  const createdEvent = new Events({
    type, home, visitor, name, tour_name, event_color, date, time, jornada, competition_id, stadium_id, images, isImportant
  });

  try {
    await createdEvent.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
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

  const { places, disponibility, type, home, visitor, name, tour_name, date, time, jornada, competition_id, stadium_id, isImportant } = req.body;
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
  event.isImportant = isImportant;
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

exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.getEventByStadiumId = getEventByStadiumId;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
