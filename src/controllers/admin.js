const catchAsync = require('../utils/catchAsync');
const {
    postService,
    marketService,
    denounceService,
    userService,
} = require('../services');

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

    market: catchAsync(async (req, res) => {
        const posts = await marketService.get({ status: 'pending' });
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        res.render('admin/market', {
            title: 'Admin',
            layout: 'admin',
            posts,
            message,
            user: req.cookies.user,
        });
    }),

    getSpamPosts: catchAsync(async (req, res, next) => {
        const posts = await postService.get({ isSpam: true });
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        res.render('admin/spam', {
            title: 'Admin',
            layout: 'admin',
            posts,
            message,
            user: req.cookies.user,
        });
    }),

    getBannedUsersList: catchAsync(async (req, res, next) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const users = await userService.get({ status: 'banned' });
        res.render('admin/banned', {
            title: 'Admin',
            layout: 'admin',
            users,
            message,
            user: req.cookies.user,
        });
    }),

    unlockUser: catchAsync(async (req, res, next) => {
        const id = req.body.id;

        if (!id) {
            req.flash('error', 'Gỡ chặn thất bại');
            return res.redirect('/admin/banned');
        }

        await userService.update(
            { _id: id },
            { status: 'active', bannedAt: null }
        );
        req.flash('success', 'Gỡ chặn thành công');
        res.redirect('/admin/banned');
    }),
};

module.exports = adminController;
