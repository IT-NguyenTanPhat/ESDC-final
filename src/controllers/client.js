const catchAsync = require('../utils/catchAsync');

const { postService } = require('../services');

const clientController = {
    profile: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const posts = await postService.get({ author: user._id });
        res.render('client/profile', {
            title: 'Trang cá nhân',
            user,
            posts,
            message,
        });
    }),
};

module.exports = clientController;
