const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { userService, redisService, emailService } = require('../services');

const authController = {
	// GET /auth/login
	loginView: (req, res) => {
		const error = req.flash('error');
		res.render('auth/login', { title: 'Đăng nhập', layout: false, error });
	},

	// POST /auth/login
	login: catchAsync(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
			return res.redirect('/auth/login');
		}
		const user = await userService.getOne({ email });
		if (user && bcrypt.compareSync(password, user.password)) {
			if (user.status === 'banned') {
				req.flash('error', 'Tài khoản này đã bị khóa');
				return res.redirect('/auth/login');
			}

			jwt.sign(
				{ email, id: user._id },
				'123',
				{ expiresIn: '1h' },
				(err, token) => {
					if (err) {
						req.flash('error', 'Đăng nhập thất bại');
						return res.redirect('/auth/login');
					} else {
						res.cookie('AuthToken', token);
						res.cookie('user', user);
						if (user.role == 'admin') return res.redirect('/admin');
						return res.redirect('/');
					}
				}
			);
		} else {
			req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
			res.redirect('/auth/login');
		}
	}),

	// GET /auth/register
	registerView: (req, res) => {
		const error = req.flash('error');
		res.render('auth/register', { title: 'Đăng ký', layout: false, error });
	},

	// POST /auth/register
	register: catchAsync(async (req, res) => {
		const { name, email, password } = req.body;
		if (!email || !password || !name) {
			req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
			return res.redirect('/auth/register');
		}
		const user = await userService.getOne({ email });
		if (user) {
			req.flash('error', 'Tên đăng nhập đã tồn tại!');
			return res.redirect('/auth/register');
		}
		await userService.create({ ...req.body, role: 'user' }).catch((err) => {
			req.flash('error', 'Đăng ký thất bại!');
			return res.redirect('/auth/register');
		});
		res.redirect('/auth/login');
	}),

	// GET /auth/change-password
	changePasswordView: (req, res, next) => {
		res.send('Render change password view');
	},

	// POST /auth/change-password
	changePassword: catchAsync(async (req, res, next) => {
		const { currentPassword, newPassword, passwordConfirm } = req.body;

		if (!currentPassword || !newPassword || !passwordConfirm) {
			return res.send('Missing data');
		}

		if (!(await bcrypt.compare(currentPassword, req.user.password))) {
			return res.send('Incorrect password');
		}

		if (passwordConfirm !== newPassword) {
			return res.send('New password and confirm password do not match');
		}

		await userService.update(
			{
				_id: req.user._id,
			},
			{
				password: await bcrypt.hash(newPassword, 12),
				passwordChangedAt: Date.now(),
			}
		);

		next();
	}),

	// GET /auth/logout
	logout: (req, res) => {
		const { token } = req.tokenData;
		// get token eat to set redis expiration
		redisService.set(`bl_${token}`, token);

		res.clearCookie('AuthToken');
		res.clearCookie('user');
		res.redirect('/auth/login');
	},

	// GET /auth/forgot-password
	forgotPasswordView: (req, res) => {
		res.send('Render forgot password view');
	},

	// POST /auth/forgot-password
	forgotPassword: catchAsync(async (req, res, next) => {
		const { email } = req.body;

		if (!email) {
			res.send('Missing data');
		}
		const user = await userService.getOne({ email });

		if (!user) {
			return res.send('Invalid email address');
		}

		if (user.status === 'banned') {
			return res.send('The account belongs to this email has been banned');
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const hashedResetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');
		redisService.set(`rs_${hashedResetToken}`, user._id.toString(), {
			EX: 300,
		});

		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/auth/reset-password/${resetToken}`;

		await emailService.sendMail({
			to: email,
			subject: 'Here is your reset token link',
			content: `<p>Please click the link below to reset your password</p><br><a href="${resetURL}">${resetURL}</a>`,
		});

		res.send(
			'Still display the current view and flash message "Reset Link has been send to your email address"'
		);
	}),

	// GET /auth/reset-password/:token
	resetPasswordView: catchAsync(async (req, res) => {
		const resetToken = req.params.token;

		if (!resetToken) {
			res.send('Missing params or redirect to /');
		}

		const hashedResetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		const userId = await redisService.get(`rs_${hashedResetToken}`);
		if (!userId) {
			return res.send('Invalid token');
		}

		global.userId = userId;
		res.send('render form to enter password and confirm password');
	}),

	// POST /auth/reset-password
	resetPassword: catchAsync(async (req, res, next) => {
		const { password, passwordConfirm } = req.body;

		if (!password || !passwordConfirm) {
			res.send('missing data');
		}

		if (password != passwordConfirm) {
			res.send('password confirm not match');
		}

		await userService.update(
			{
				_id: global.userId,
			},
			{
				password: await bcrypt.hash(password, 12),
				passwordChangedAt: Date.now(),
			}
		);

		res.send('Redirect to login page');
	}),
};

module.exports = authController;
