const express = require('express');
const { check } = require('express-validator');

const teamsControllers = require('../controllers/teams-controllers');

const router = express.Router();

router.get('/:pid', teamsControllers.getTeamById);
router.get('/stadium/:pid', teamsControllers.getTeamByStadiumId);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('country')
      .not()
      .isEmpty(),
    check('stadium_id')
      .not()
      .isEmpty(),
    check('principal_color')
      .not()
      .isEmpty(),
    check('secundary_color')
      .not()
      .isEmpty(),
  ],
  teamsControllers.createTeam
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
    check('stadium_id')
      .not()
      .isEmpty(),
    check('principal_color')
      .not()
      .isEmpty(),
    check('secundary_color')
      .not()
      .isEmpty(),
  ],
  teamsControllers.updateTeam
);

router.delete('/:pid', teamsControllers.deleteTeam);

module.exports = router;
