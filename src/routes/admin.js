const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');
const passportCfg = require('../config/passport'); // eslint-disable-line

// get
router.get('/submission_list', AdminController.getSubmissionList);
router.get('/userdocuments', AdminController.getUserDocuments);
router.get('/verify/:ownerConfirmToken', AdminController.getVerifyOwner);

// post
router.post('/signup', AdminController.postSignup);
router.post('/signin', AdminController.postLogin);
router.post('/approve_user', AdminController.postApproveUser);

router.post('/update/identity', AdminController.postUpdateIdentity);
router.post('/update/selfie', AdminController.postUpdateSelfie);

module.exports = router;
