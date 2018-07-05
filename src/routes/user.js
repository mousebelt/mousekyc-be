const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// get
router.get('/info/:token', userController.getInfoToken);
router.get('/passport/info/:token', userController.getPassportInfo);

// post
router.post('/gentoken', userController.postGenToken);
router.post('/update', userController.postUpdate);
router.post('/update/identity', userController.postUpdateIdentity);
router.post('/update/selfie', userController.postUpdateSelfie);

// kyc integration
router.post('/init', userController.postInit);

module.exports = router
