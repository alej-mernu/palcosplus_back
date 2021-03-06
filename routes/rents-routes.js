const express = require('express');
const { check } = require('express-validator');

const rentsControllers = require('../controllers/rents-controllers');

const router = express.Router();

router.get('/', rentsControllers.getRents);
router.get('/active', rentsControllers.getActiveRents);
router.get('/:id', rentsControllers.getRentsId);

router.post(
  '/',
  rentsControllers.createRent
);

router.patch('/:id',rentsControllers.updateRent);
router.delete('/palco/:id',rentsControllers.deleteRentByPalcoId);
router.delete('/event/:id',rentsControllers.deleteRentByEventId);

module.exports = router;
