const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/allUsers', usersController.getAllUsers);
router.get('/:pid', usersController.getUserById);

router.post(
  '/signup',
  fileUpload.single('image'),
  [check('name').not().isEmpty(), check('password').not().isEmpty()],
  usersController.signup
);

router.post('/login', usersController.login);
router.patch('/update', fileUpload.single('image'), usersController.updateUser);
router.delete('/:uid', usersController.deleteUser);

module.exports = router;
