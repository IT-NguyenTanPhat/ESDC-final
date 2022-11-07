const express = require('express');
const router = express.Router();

const { courseController } = require('../controllers');

router.get('/', courseController.index);

module.exports = router;
