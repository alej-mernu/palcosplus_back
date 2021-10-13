const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', eventsControllers.getAllEvents);
router.get('/:id', eventsControllers.getEventById);
router.get('/stadium/:pid', eventsControllers.getEventByStadiumId);
router.get('/principal/:pid', eventsControllers.getPrincipalEvents);

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
    check('date')
      .not()
      .isEmpty(),
    check('stadium_id')
      .not()
      .isEmpty(),
  ],
  eventsControllers.updateEvent
);

router.delete('/:pid', eventsControllers.deleteEvent);
router.delete('/stadium/:id', eventsControllers.deleteEvenyByStadiumId);
router.delete('/team/:id', eventsControllers.deleteEvenyByTeamId);
router.delete('/competition/:id', eventsControllers.deleteEvenyByCompetitionId);

module.exports = router;
