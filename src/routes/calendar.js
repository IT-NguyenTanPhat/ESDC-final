const express = require('express');
const router = express.Router();

const { calendarController } = require('../controllers');

// Current path: /calendar
router.get('/', calendarController.index);

module.exports = router;
