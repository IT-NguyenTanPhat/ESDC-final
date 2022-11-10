const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');

// Current path: /auth
router.get('/', (req, res) => {
	res.redirect('auth/login');
});
router.get('/login', authController.loginView);
router.post('/login', authController.login);
router.get('/register', authController.registerView);
router.post('/register', authController.register);
router.get('/change-password', authController.changePasswordView);
router.post(
	'/change-password',
	authController.changePassword,
	authController.logout
);
router.get('/forgot-password', authController.forgotPasswordView);
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password/:token', authController.resetPasswordView);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/logout', authController.logout);

module.exports = router;
