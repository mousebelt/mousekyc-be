const express = require('express');

// Importing sub-routers
const globalRouter = require('./global');
const userRouter = require('./user');
const adminRouter = require('./admin');

// Obtaining router
const router = express.Router();

// Setting routes
router.use('/global', globalRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);

module.exports = router;
