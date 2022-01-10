const express = require('express');
const { check } = require('express-validator');

const eventPalcoControllers = require('../controllers/event-palco-controllers');

const router = express.Router();

router.get('/', eventPalcoControllers.getAllEventPalco);
router.get('/:pid/:eid', eventPalcoControllers.getEventPalcoByIds);

// router.post(
//   '/',
//   [check('event_id').not().isEmpty(), check('palco_id').not().isEmpty()],
//   eventPalcoControllers.createEventPalco
// );

router.post('/', eventPalcoControllers.addEventPalco);

module.exports = router;
