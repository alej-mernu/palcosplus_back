const express = require('express');
const { check } = require('express-validator');

const palcosControllers = require('../controllers/palcos-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', palcosControllers.getAllPalcos);
router.get('/:id', palcosControllers.getPalcoById);
router.get('/stadium/:pid', palcosControllers.getPalcoByStadiumId);

router.post(
  '/',
  fileUpload.array('images'),
  [
    check('name')
      .not()
      .isEmpty(),
  ],
  palcosControllers.createPalco
);

router.patch(
  '/:pid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('level')
      .not()
      .isEmpty(),
    check('zone')
      .not()
      .isEmpty(),
    check('num_cards')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty(),
    check('price')
      .not()
      .isEmpty(),
    check('active')
      .not()
      .isEmpty(),
    check('stadium_id')
      .not()
      .isEmpty(),
    check('user_id')
      .not()
      .isEmpty(),
    check('access')
      .not()
      .isEmpty(),
    check('comision')
      .not()
      .isEmpty()
  ],
  palcosControllers.updatePalco
);

router.delete('/:pid', palcosControllers.deletePalco);

module.exports = router;
