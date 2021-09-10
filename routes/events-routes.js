const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', eventsControllers.getAllEvents);
router.get('/:id', eventsControllers.getEventById);
router.get('/stadium/:pid', eventsControllers.getEventByStadiumId);

router.post(
  '/',
  fileUpload.array('images'),
  [
    check('date')
      .not()
      .isEmpty(),
    check('stadium_id')
      .not()
      .isEmpty(),
  ],
  eventsControllers.createEvent
);

router.patch(
  '/:pid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('places')
      .not()
      .isEmpty(),
    check('disponibility')
      .not()
      .isEmpty(),
    check('type')
      .not()
      .isEmpty(),
    check('date')
      .not()
      .isEmpty(),
    check('time')
      .not()
      .isEmpty(),
    check('jornada')
      .not()
      .isEmpty(),
    check('competition')
      .not()
      .isEmpty(),
    check('stadium_id')
      .not()
      .isEmpty(),
  ],
  eventsControllers.updateEvent
);

router.delete('/:pid', eventsControllers.deleteEvent);

module.exports = router;
