const express = require('express');
const { check } = require('express-validator');

const stadiumsControllers = require('../controllers/stadiums-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', stadiumsControllers.getAllStadiums);
router.get('/:id', stadiumsControllers.getStadiumById);

router.post(
  '/',
  fileUpload.array('images'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('country')
      .not()
      .isEmpty(),
    check('city')
      .not()
      .isEmpty(),
    check('capacity')
      .not()
      .isEmpty(),
    check('fundation_date')
      .not()
      .isEmpty(),
    check('local_teams')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty(),
    check('location')
      .not()
      .isEmpty(),
    check('zones')
      .not()
      .isEmpty(),
    check('access')
      .not()
      .isEmpty()
  ],
  stadiumsControllers.createStadium
);

router.patch(
  '/:pid',
  fileUpload.array('images'),
  stadiumsControllers.updateStadium
);

router.delete('/:pid', stadiumsControllers.deleteStadium);

module.exports = router;
