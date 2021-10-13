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
  ],
  palcosControllers.updatePalco
);

router.delete('/:pid', palcosControllers.deletePalco);
router.delete('/stadium/:id', palcosControllers.deletePalcoByStadiumId);

module.exports = router;
