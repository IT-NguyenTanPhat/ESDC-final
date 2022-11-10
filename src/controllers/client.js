const catchAsync = require('../utils/catchAsync');

const { postService, courseService, marketService, userService } = require('../services');

const clientController = {
    profile: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const posts = await postService.get({ author: user._id });
        const marketPosts = await marketService.get({ author: user._id });
        res.render('client/profile', {
            title: 'Trang cá nhân',
            user,
            posts,
            marketPosts,
            message,
        });
    }),

    getCalendar: catchAsync(async (req, res) => {
        const event = [];
        const courses = await courseService.get(
            {
                examinations: { $ne: null },
            },
            null,
            false
        );
        courses.map((course) => {
            course.examinations.map((item) => {
                event.push({
                    title: `${course.name} - ${item.title}`,
                    start: item.time,
                });
            });
        });
        res.json(event);
    }),

    reportUser: catchAsync(async (req, res, next) => {
        const { userId, reason } = req.body;
        const user = await userService.get({ _id: userId }, 'status');
        if (!userId || !reason || !user || user.status === 'banned') {
            req.flash('error', 'Báo cáo người dùng thất bại');
            return res.redirect('/posts');
        }

        const report = await denounceService.create({
            reporter: req.user._id,
            reason,
            userId,
        });
        res.json(report);
    }),
};

module.exports = clientController;
