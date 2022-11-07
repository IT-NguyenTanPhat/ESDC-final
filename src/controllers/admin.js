const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');

const adminController = {
    index: catchAsync(async (req, res) => {
        const posts = await postService.get({ status: 'pending' });
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        res.render('admin/index', {
            title: 'Admin',
            layout: 'admin',
            posts,
            message,
            user: req.cookies.user,
        });
    }),

    profile: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        res.render('admin/profile', {
            title: 'Trang cá nhân',
            user,
            layout: 'admin',
        });
    }),
};

module.exports = adminController;
