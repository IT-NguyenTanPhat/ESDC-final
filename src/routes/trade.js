const express = require('express');
const router = express.Router();

const { tradeController } = require('../controllers');

router.get('/', tradeController.index);

module.exports = router;
