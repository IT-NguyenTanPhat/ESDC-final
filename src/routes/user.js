const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.get('/get-users-list', userController.getUsersList);
router.get('/get-report-list', userController.getReportList);
router.get('/get-banned-users-list', userController.getBannedUsersList);
router.get('/profile/:id', userController.getProfile);
router.get('/profile', userController.getProfile);
router.post('/report-user', userController.reportUser);
router.post('/remove-report', userController.removeReport);
router.post('/ban-user', userController.banUser);
router.post('/unlock-user', userController.unlockUser);

module.exports = router;
