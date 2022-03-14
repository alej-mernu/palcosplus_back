const express = require('express');

const emailsControllers = require('../controllers/emails-controllers');

const router = express.Router();

router.post('/', emailsControllers.sendEmail);
router.post('/nodemailer', emailsControllers.nodemailerEmail);
router.post('/confirmation', emailsControllers.sendConfirmation);
router.post('/question', emailsControllers.sendQuestions);
router.post('/application', emailsControllers.sendApplication);
router.post('/confirmationAdmin', emailsControllers.sendConfirmationToAdmin);

module.exports = router;
