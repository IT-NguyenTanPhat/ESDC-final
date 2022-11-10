const express = require('express');
const router = express.Router();

const postRouter = require('./post');
const calendarRouter = require('./calendar');
const marketRouter = require('./market');
const courseRouter = require('./course');

const { clientController } = require('../controllers');

// Current path: /
router.get('/profile', clientController.profile);
router.get('/get-calendar', clientController.getCalendar);
router.use('/posts', postRouter);
router.use('/calendar', calendarRouter);
router.use('/market', marketRouter);
router.use('/', courseRouter);

module.exports = router;
