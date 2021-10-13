const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Reservation = require('../models/reservation');
const { deleteRentByEventId } = require('./rents-controllers');

const getReservationById = async (req, res, next) => {
  const reservationId = req.params.pid;

  let reservation;
  try {
    reservation = await Reservation.findById(reservationId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a reservation.',
      500
    );
    return next(error);
  }

  if (!reservation) {
    const error = new HttpError(
      'Could not find a reservation for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ reservation: reservation.toObject({ getters: true }) });
};

const getReservationByPalcoId = async (req, res, next) => {
  const palcoId = req.params.uid;

  let reservations;
  try {
    reservations = await Palco.find({ palco_id: palcoId });
  } catch (err) {
    const error = new HttpError(
      'Fetching reservations failed, please try again later',
      500
    );
    return next(error);
  }

  if (!reservations || reservations.length === 0) {
    return next(
      new HttpError('Could not find reservations for the provided user id.', 404)
    );
  }

  res.json({ reservations: reservations.map(reservation => reservation.toObject({ getters: true })) });
};

const getReservationByEventId = async (req, res, next) => {
  const eventId = req.params.uid;

  let reservations;
  try {
    reservations = await Palco.find({ event_id: eventId });
  } catch (err) {
    const error = new HttpError(
      'Fetching reservations failed, please try again later',
      500
    );
    return next(error);
  }

  if (!reservations || reservations.length === 0) {
    return next(
      new HttpError('Could not find reservations for the provided user id.', 404)
    );
  }

  res.json({ reservations: reservations.map(reservation => reservation.toObject({ getters: true })) });
};

const getReservationByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let reservations;
  try {
    reservations = await Palco.find({ user_id: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching reservations failed, please try again later',
      500
    );
    return next(error);
  }

  if (!reservations || reservations.length === 0) {
    return next(
      new HttpError('Could not find reservations for the provided user id.', 404)
    );
  }

  res.json({ reservations: reservations.map(reservation => reservation.toObject({ getters: true })) });
};

const createReservation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { aviability_date, price, status, event_id, palco_id, user_id }= req.body;

  const createdReservation = new Reservation({
    aviability_date, price, status, event_id, palco_id, user_id
  });

  try {
    await createdReservation.save();
  } catch (err) {
    const error = new HttpError(
      'Creating reservation failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ reservation: createdReservation });
};

const updateReservation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { aviability_date, price, status, event_id, palco_id, user_id } = req.body;
  const reservationId = req.params.pid;

  let reservation;
  try {
    reservation = await Reservation.findById(reservationId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update reservation.',
      500
    );
    return next(error);
  }

  reservation.aviability_date=aviability_date;
  reservation.price=price;
  reservation.status=status;
  reservation.event_id=event_id;
  reservation.palco_id=palco_id;
  reservation.user_id=user_id;
  reservation.modified_date=Date.now;

  try {
    await reservation.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update reservation.',
      500
    );
    return next(error);
  }

  res.status(200).json({ reservation: reservation.toObject({ getters: true }) });
};

const deleteReservation = async (req, res, next) => {
  const reservationId = req.params.pid;

  let reservation;
  try {
    reservation = await Reservation.findById(reservationId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete reservation.',
      500
    );
    return next(error);
  }

  try {
    await reservation.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete reservation.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted reservation.' });
};

const deleteReservationByPalcoId = async (req, res, next) => {
  const palcoId = req.params.id;

  try {
    await Reservation.deleteMany({ palco_id: palcoId });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete reservation.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted reservation.' });
};

const deleteReservationByEventId = async (req, res, next) => {
  const eventId = req.params.id;

  try {
    await Reservation.deleteMany({ event_id: eventId });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete reservation.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted reservation.' });
};

exports.getReservationById = getReservationById;
exports.getReservationByPalcoId = getReservationByPalcoId;
exports.getReservationByEventId = getReservationByEventId;
exports.getReservationByUserId = getReservationByUserId;
exports.createReservation = createReservation;
exports.updateReservation = updateReservation;
exports.deleteReservation = deleteReservation;
exports.deleteRentByEventId = deleteRentByEventId;
exports.deleteReservationByPalcoId = deleteReservationByPalcoId;
