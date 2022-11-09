const express = require('express');
const router = express.Router();

const { marketController } = require('../controllers');

// Current path: /market
router.get('/', marketController.index);

module.exports = router;
