const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/isLoggedIn');

const authRouter = require('./auth');
const adminRouter = require('./admin');
const clientRouter = require('./client');

/* GET home page. */
router.use('/', isLoggedIn);
router.use('/', clientRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);

module.exports = router;
