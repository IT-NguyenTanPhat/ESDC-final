const express = require('express');
const router = express.Router();

const { marketController } = require('../controllers');

// Current path: /market
router.get('/', marketController.index);
router.post('/create', marketController.create);
router.post('/update', marketController.update);
router.post('/censor', marketController.censor);
router.post('/delete', marketController.delete);

module.exports = router;
