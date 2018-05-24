const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// get

// post
router.post('/add', userController.postAdd);
router.post('/update', userController.postUpdate);

module.exports = router
