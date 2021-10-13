const express = require('express');
const { check } = require('express-validator');

const reservationControllers = require('../controllers/reservations-controllers');

const router = express.Router();

router.get('/:pid', reservationControllers.getReservationById);
router.get('/event/:pid', reservationControllers.getReservationByEventId);
router.get('/palco/:pid', reservationControllers.getReservationByPalcoId);
router.get('/user/:pid', reservationControllers.getReservationByUserId);

router.post(
  '/',
  [
    check('aviability_date')
      .not()
      .isEmpty(),
    check('price')
      .not()
      .isEmpty(),
    check('status')
      .not()
      .isEmpty(),
    check('event_id')
      .not()
      .isEmpty(),
    check('palco_id')
      .not()
      .isEmpty(),
    check('user_id')
      .not()
      .isEmpty(),
  ],
  reservationControllers.createReservation
);

router.patch(
  '/:pid',
  [
    check('aviability_date')
      .not()
      .isEmpty(),
    check('price')
      .not()
      .isEmpty(),
    check('status')
      .not()
      .isEmpty(),
    check('event_id')
      .not()
      .isEmpty(),
    check('palco_id')
      .not()
      .isEmpty(),
    check('user_id')
      .not()
      .isEmpty(),
  ],
  reservationControllers.updateReservation
);

router.delete('/:pid', reservationControllers.deleteReservation);
router.delete('/event/:pid', reservationControllers.deleteRentByEventId);
router.delete('/palco/:pid', reservationControllers.deleteReservationByPalcoId);

module.exports = router;
