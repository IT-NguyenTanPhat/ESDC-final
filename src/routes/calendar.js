const express = require('express');
const router = express.Router();

const { calendarController } = require('../controllers');

router.get('/', calendarController.index);

module.exports = router;
