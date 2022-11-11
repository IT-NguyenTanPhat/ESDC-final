const catchAsync = require('../utils/catchAsync');
const { postService, userService } = require('../services');

const postController = {
    index: catchAsync(async (req, res) => {
        const message = {
            error: req.flash('error'),
            success: req.flash('success'),
        };
        const posts = await postService.get({
            status: 'success',
            description: { $regex: req.query.search || '', $options: 'i' },
        });
        res.render('client/post', {
            title: 'Điểm rèn luyện',
            posts,
            message,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        if (!user || !req.body.url) {
            req.flash('error', 'Đăng bài viết thất bại');
            return res.redirect('/profile');
        }
        await postService
            .create({ ...req.body, author: user._id })
            .catch((err) => {
                req.flash('error', 'Đăng bài viết thất bại');
                return res.redirect('/profile');
            });
        req.flash('success', 'Đăng bài viết thành công');
        res.redirect('/profile');
    }),

    update: catchAsync(async (req, res) => {
        const { url, id } = req.body;
        const post = await postService.getOne({ _id: id });
        if (!url || !post) {
            req.flash('error', 'Cập nhật bài viết thất bại');
            return res.redirect('/profile');
        }
        await postService.update({ _id: id }, { ...req.body }).catch((err) => {
            req.flash('error', 'Cập nhật bài viết thất bại');
            return res.redirect('/profile');
        });
        req.flash('success', 'Cập nhật bài viết thành công');
        res.redirect('/profile');
    }),

    unSpam: catchAsync(async (req, res) => {
        const { id } = req.body;
        const post = await postService.getOne({ _id: id });
        if (!post) {
            req.flash('error', 'Gỡ spam thất bại');
            return res.redirect('back');
        }
        await postService
            .update({ _id: id }, { isSpam: false })
            .catch((err) => {
                req.flash('error', 'Gỡ spam thất bại');
                return res.redirect('back');
            });
        req.flash('success', 'Gỡ spam thành công');
        res.redirect('back');
    }),

    censor: catchAsync(async (req, res) => {
        const { id } = req.body;
        const post = await postService.getOne({ _id: id });
        if (!post) {
            req.flash('error', 'Duyệt bài viết thất bại');
            return res.redirect('/admin');
        }
        await postService
            .update({ _id: id }, { status: 'success' })
            .catch((err) => {
                req.flash('error', 'Duyệt bài viết thất bại');
                return res.redirect('/admin');
            });
        req.flash('success', 'Duyệt bài viết thành công');
        res.redirect('/admin');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const post = await postService.getOne({ _id: id });
        if (!post) {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('/back');
        }
        if (req.body.banId) {
            await userService
                .update(
                    { _id: req.body.banId },
                    { status: 'banned', bannedAt: Date.now() }
                )
                .catch((err) => {
                    req.flash('error', 'Cấm người dùng thất bại');
                    return res.redirect('back');
                });
        }
        await postService.delete({ _id: id }).catch((err) => {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('back');
        });
        req.flash('success', 'Xoá bài viết thành công');
        res.redirect('back');
    }),
};

module.exports = postController;
