const express = require('express')
const router = express.Router()
const passportController = require('../controllers/passport')
const AdminController = require('../controllers/admin')

// get
router.get('/submission_list', AdminController.getSubmissionList)

// post
router.post('/signup', AdminController.postSignup)
router.post('/signin', AdminController.postLogin)
router.post('/approve_user', AdminController.postApproveUser)

router.post('/update/identity', AdminController.postUpdateIdentity);
router.post('/update/selfie', AdminController.postUpdateSelfie);

module.exports = router
