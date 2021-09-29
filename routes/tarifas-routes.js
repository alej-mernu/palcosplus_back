const express = require('express');
const { check } = require('express-validator');

const tarifasControllers = require('../controllers/traifas-controllers');

const router = express.Router();

router.get('/', tarifasControllers.getAllTarifas);
router.get('/:zip', tarifasControllers.getTarifaByPostalCode);
router.get('/stadium/:id', tarifasControllers.getTarifaByStadiumId);

router.post('/', tarifasControllers.createTarifa
);

module.exports = router;
