const express = require('express');
const router = express.Router();
const globalController = require('../controllers/global');

// get
router.get('/countries', globalController.getCountries);
router.get('/image/:filename', globalController.getImageFile);

// post

module.exports = router;
