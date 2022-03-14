const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');

const manualsControllers = require('../controllers/manual-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', manualsControllers.getManuals);
router.get('/download/:filename', manualsControllers.downloadManual);
router.delete('/', manualsControllers.deleteManual);

router.post('/', fileUpload.single('image'), manualsControllers.createManual);

module.exports = router;
