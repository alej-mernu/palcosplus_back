const express = require('express');

const paymentsControllers = require('../controllers/payments-controllers');

const router = express.Router();

router.post('/', paymentsControllers.paymentCheckout);

module.exports = router;