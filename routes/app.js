const express = require('express')

// Importing sub-routers
const globalRouter = require('./global')

// Obtaining router
const router = express.Router()

// Setting routes
router.use('/global', globalRouter)

module.exports = router
