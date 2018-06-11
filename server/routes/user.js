const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// get
router.get('/info/:token', userController.getInfoToken);

// post
router.post('/gentoken', userController.postGenToken);
// router.post('/add', userController.postAdd);
router.post('/update', userController.postUpdate);
router.post('/update/identity', userController.postUpdate);
router.post('/update/selfie', userController.postUpdate);

module.exports = router
