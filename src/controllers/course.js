const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');

const courseController = {
	index: catchAsync(async (req, res) => {
		const user = req.cookies.user;
		const message = {
			error: req.flash('error'),
			success: req.flash('success'),
		};
		const courses = await courseService.get({ author: user._id });
		res.render('client/index', {
			title: 'Trang chủ',
			user,
			courses,
			message,
		});
	}),

	detail: catchAsync(async (req, res) => {
		const message = {
			error: req.flash('error'),
			success: req.flash('success'),
		};
		const course = await courseService.getOne({ _id: req.params.id });
		res.render('client/course/index', {
			title: course.name,
			user: req.cookies.user,
			course,
			message,
		});
	}),

	materialView: catchAsync(async (req, res) => {
		const message = {
			error: req.flash('error'),
			success: req.flash('success'),
		};
		const course = await courseService.getOne(
			{ _id: req.params.id },
			'name materials -author'
		);
		course.materials = course.materials[req.params.idx];
		res.render('client/course/material', {
			title: course.materials.title,
			user: req.cookies.user,
			course,
			message,
		});
	}),

	createMaterial: catchAsync(async (req, res) => {
		const { title, id, content } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!title || !course) {
			req.flash('error', 'Thêm ghi chú thất bại');
			return res.redirect(`/${id}`);
		}
		const material = { title, content };
		await courseService
			.update({ _id: id }, { $push: { materials: material } })
			.catch((err) => {
				req.flash('error', 'Thêm ghi chú thất bại');
				return res.redirect(`/${id}`);
			});
		req.flash('success', 'Thêm ghi chú thành công');
		res.redirect(`/${id}`);
	}),

	updateMaterial: catchAsync(async (req, res) => {
		const { name, id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!name || !course) {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect(`/${id}`);
		}
		await courseService.update({ _id: id }, { ...req.body }).catch((err) => {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect(`/${id}`);
		});
		req.flash('success', 'Cập nhật bài viết thành công');
		res.redirect(`/${id}`);
	}),

	deleteMaterial: catchAsync(async (req, res) => {
		const { idx, id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!idx || !course) {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		}
		await courseService.update({ _id: id }, { ...req.body }).catch((err) => {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		});
		req.flash('success', 'Cập nhật bài viết thành công');
		res.redirect('/');
	}),

	examinationView: catchAsync(async (req, res) => {
		const message = {
			error: req.flash('error'),
			success: req.flash('success'),
		};
		const course = await courseService.getOne(
			{ _id: req.params.id },
			'name examinations -author'
		);
		course.examinations = course.examinations[req.params.idx];
		res.render('client/course/examination', {
			title: course.examinations.title,
			user: req.cookies.user,
			course,
			message,
		});
	}),

	createExamination: catchAsync(async (req, res) => {
		const { title, id, content, time } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!title || !course || !time) {
			req.flash('error', 'Thêm lịch kiểm tra thất bại');
			return res.redirect(`/${id}`);
		}
		const examination = { title, content, time };
		await courseService
			.update({ _id: id }, { $push: { examinations: examination } })
			.catch((err) => {
				req.flash('error', 'Thêm lịch kiểm tra thất bại');
				return res.redirect(`/${id}`);
			});
		req.flash('success', 'Thêm lịch kiểm tra thành công');
		res.redirect(`/${id}`);
	}),

	updateExamination: catchAsync(async (req, res) => {
		const { name, id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!name || !course) {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		}
		await courseService.update({ _id: id }, { ...req.body }).catch((err) => {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		});
		req.flash('success', 'Cập nhật bài viết thành công');
		res.redirect('/');
	}),

	deleteExamination: catchAsync(async (req, res) => {
		const { name, id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!name || !course) {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		}
		await courseService.update({ _id: id }, { ...req.body }).catch((err) => {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		});
		req.flash('success', 'Cập nhật bài viết thành công');
		res.redirect('/');
	}),

	create: catchAsync(async (req, res) => {
		const user = req.cookies.user;
		if (!user || !req.body.name) {
			req.flash('error', 'Thêm môn học thất bại');
			return res.redirect('/');
		}
		await courseService
			.create({ ...req.body, author: user._id })
			.catch((err) => {
				req.flash('error', 'Thêm môn học thất bại');
				return res.redirect('/profile');
			});
		req.flash('success', 'Thêm môn học thành công');
		res.redirect('/');
	}),

	update: catchAsync(async (req, res) => {
		const { name, id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!name || !course) {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		}
		await courseService.update({ _id: id }, { ...req.body }).catch((err) => {
			req.flash('error', 'Cập nhật bài viết thất bại');
			return res.redirect('/');
		});
		req.flash('success', 'Cập nhật bài viết thành công');
		res.redirect('/');
	}),

	delete: catchAsync(async (req, res) => {
		const { id } = req.body;
		const course = await courseService.getOne({ _id: id });
		if (!course) {
			req.flash('error', 'Xoá bài viết thất bại');
			return res.redirect('/');
		}
		await courseService.delete({ _id: id }).catch((err) => {
			req.flash('error', 'Xoá bài viết thất bại');
			return res.redirect('/');
		});
		req.flash('success', 'Xoá bài viết thành công');
		res.redirect('/');
	}),
};

courseService.startExamReminderScheduler();

module.exports = courseController;
