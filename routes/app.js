const express = require('express')

// Importing sub-routers
const globalRouter = require('./global')
const userRouter = require('./user')

// Obtaining router
const router = express.Router()

// Setting routes
router.use('/global', globalRouter)
router.use('/user', userRouter)

module.exports = router
