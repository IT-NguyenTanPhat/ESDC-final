const catchAsync = require('../utils/catchAsync');
const { userService, denounceService } = require('../services');

const excludeFields = '-password -passwordChangedAt -username';

const userController = {
	// GET /user/get-users-list
	getUsersList: catchAsync(async (req, res, next) => {
		const users = await userService.get({}, excludeFields);
		res.json(users);
	}),

	// GET /user/profile/:id
	getProfile: catchAsync(async (req, res, next) => {
		let id = req.params.id;

		if (!id) {
			id = req.user._id;
		}
		const user = await userService.getOne({ _id: id }, excludeFields);
		res.json(user);
	}),

	// GET /user/get-report-list
	getReportList: catchAsync(async (req, res, next) => {
		const reports = await denounceService.get();
		res.json(reports);
	}),

	// GET /user/get-banned-users-list
	getBannedUsersList: catchAsync(async (req, res, next) => {
		const users = await userService.get(
			{ status: 'banned' },
			'bannedAt _id name'
		);
		res.json(users);
	}),

	// POST /user/ban-user
	banUser: catchAsync(async (req, res, next) => {
		const id = req.body.id;

		const user = await userService.update(
			{ _id: id },
			{ status: 'banned', bannedAt: Date.now() }
		);

		await denounceService.delete({ userId: id });
		res.json(user);
	}),

	// POST /user/report-user
	reportUser: catchAsync(async (req, res, next) => {
		const { userId, reason } = req.body;
		if (!userId || !reason) {
			return res.send('Missing data');
		}

		const user = await userService.get({ _id: userId }, 'status');
		if (!user) {
			return res.send('Unknown user');
		}

		if (user.status === 'banned') {
			return res.send('User has already been banned');
		}

		const report = await denounceService.create({
			reporter: req.user._id,
			reason,
			userId,
		});
		res.json(report);
	}),

	// POST /user/unlock-user
	unlockUser: catchAsync(async (req, res, next) => {
		const id = req.body.id;

		if (!id) {
			return res.send('Missing id');
		}

		const user = await userService.update(
			{ _id: id },
			{ status: 'active', bannedAt: null }
		);
		res.json(user);
	}),

	// POST /user/remove-report
	removeReport: catchAsync(async (req, res, next) => {
		const id = req.body.id;

		const report = await denounceService.delete({ _id: id });
		res.json(report);
	}),
};

module.exports = userController;
