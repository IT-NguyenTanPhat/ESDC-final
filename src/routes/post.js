const express = require('express');
const router = express.Router();

const { postController } = require('../controllers');

// Current path: /posts
router.get('/', postController.index);
router.post('/create', postController.create);
router.post('/update', postController.update);
router.post('/un-spam', postController.unSpam);
router.post('/censor', postController.censor);
router.post('/delete', postController.delete);

module.exports = router;
