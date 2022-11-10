const catchAsync = require('../utils/catchAsync');

const { postService, courseService, marketService } = require('../services');

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
};

module.exports = clientController;
