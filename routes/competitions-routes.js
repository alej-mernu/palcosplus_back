const express = require('express');
const { check } = require('express-validator');

const competitionsControllers = require('../controllers/competitions-controllers');

const router = express.Router();

router.get('/:pid', competitionsControllers.getCompetitionById);
router.get('/', competitionsControllers.getAllCompetition);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('type')
      .not()
      .isEmpty(),
  ],
  competitionsControllers.createCompetition
);

router.patch(
  '/:pid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('type')
      .not()
      .isEmpty(),
  ],
  competitionsControllers.updateCompetition
);

router.delete('/:pid', competitionsControllers.deleteCompetition);

module.exports = router;
