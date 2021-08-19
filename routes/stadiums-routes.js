const express = require('express');
const { check } = require('express-validator');

const stadiumsControllers = require('../controllers/stadiums-controllers');

const router = express.Router();

router.get('/', stadiumsControllers.getAllStadiums);
router.get('/:pid', stadiumsControllers.getStadiumById);

router.post(
  '/',
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
    check('address')
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
    check('fundation')
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
    check('address')
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
    check('fundation')
      .not()
      .isEmpty(),
    check('zones')
      .not()
      .isEmpty(),
    check('access')
      .not()
      .isEmpty()
  ],
  stadiumsControllers.updateStadium
);

router.delete('/:pid', stadiumsControllers.deleteStadium);

module.exports = router;
