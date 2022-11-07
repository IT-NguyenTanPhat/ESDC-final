const express = require('express');
const router = express.Router();

const postRouter = require('./post');
const calendarRouter = require('./calendar');
const tradeRouter = require('./trade');
const courseRouter = require('./course');

const { clientController } = require('../controllers');

router.use('/', courseRouter);
router.get('/profile', clientController.profile);
router.use('/posts', postRouter);
router.use('/calendar', calendarRouter);
router.use('/market', tradeRouter);

module.exports = router;
