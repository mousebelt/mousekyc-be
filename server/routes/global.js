const express = require('express')
const router = express.Router()
const globalController = require('../controllers/global')

// get
router.get('/countries', globalController.getCountries)

// post

module.exports = router
