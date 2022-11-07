const express = require('express');
const router = express.Router();

const { adminController } = require('../controllers');
const isAdmin = require('../middlewares/isAdmin');

router.use(isAdmin);
router.get('/', adminController.index);
router.get('/profile', adminController.profile);

module.exports = router;
