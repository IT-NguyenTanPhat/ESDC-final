const jwt = require('jsonwebtoken');
const { userService, redisService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const PATH_FOR_ANONYMOUS = [
	'/register',
	'/login',
	'/reset-password',
	'/forgot-password',
];

const isLoggedIn = async (req) => {
	const token = req.cookies.AuthToken;
	if (!token) return false;

	const isInBlacklist = await redisService.get(`bl_${token}`);
	if (isInBlacklist) return false;

	return jwt.verify(token, '123', async (err, data) => {
		if (err) {
			return false;
		}

		const { id, iat } = data;
		const user = await userService.getOne({ _id: id });

		if (
			!user ||
			(user.passwordChangedAt && user.passwordChangedAt.valueOf() > iat * 1000)
		) {
			return false;
		}

		if (user.status === 'banned') {
			return false;
		}

		return { tokenData: { ...data, token }, user };
	});
};

module.exports = catchAsync(async (req, res, next) => {
	const path = req.originalUrl;
	const isPathForAnonymous = PATH_FOR_ANONYMOUS.some((endpoint) =>
		path.includes(endpoint)
	);
	const checkLoggedInResult = await isLoggedIn(req);

	if (!checkLoggedInResult && isPathForAnonymous) {
		return next();
	}

	if (checkLoggedInResult && !isPathForAnonymous) {
		req.tokenData = checkLoggedInResult.tokenData;
		req.user = checkLoggedInResult.user;

		return next();
	}

	if (isPathForAnonymous) {
		return res.redirect('/');
	}

	res.status(403);
	req.flash('error', 'Vui lòng đăng nhập.');
	return res.redirect('/auth/login');
});
