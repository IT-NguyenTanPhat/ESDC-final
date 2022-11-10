const express = require('express');
const router = express.Router();

const classifyUser = require('../middlewares/classifyUser');

const authRouter = require('./auth');
const adminRouter = require('./admin');
const clientRouter = require('./client');

// Current path: /
router.use(classifyUser);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/', clientRouter);

module.exports = router;
