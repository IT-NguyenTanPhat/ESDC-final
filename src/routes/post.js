const express = require('express');
const router = express.Router();

const { postController } = require('../controllers');

router.get('/', postController.index);
router.post('/', postController.create);
router.post('/update', postController.update);
router.post('/censor', postController.censor);
router.post('/delete', postController.delete);

module.exports = router;
