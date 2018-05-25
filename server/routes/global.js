const express = require('express')
const router = express.Router()
const globalController = require('../controllers/global')

// get
router.get('/coins', globalController.getCoins)

// post

module.exports = router
