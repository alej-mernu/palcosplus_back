const express = require('express');
const { check } = require('express-validator');

const teamsControllers = require('../controllers/teams-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', teamsControllers.getAllTeams);
router.get('/:pid', teamsControllers.getTeamById);
router.get('/stadium/:pid', teamsControllers.getTeamByStadiumId);

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
router.delete('/stadium/:pid', teamsControllers.deleteTeamByStadiumId);

module.exports = router;
