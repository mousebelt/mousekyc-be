const express = require('express')
const router = express.Router()
const passportController = require('../controllers/passport')
const AdminController = require('../controllers/admin')

// post
router.post('/signup', AdminController.postSignup)
router.post('/signin', AdminController.postLogin)

module.exports = router
