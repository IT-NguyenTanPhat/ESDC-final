const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');

const postController = {
    index: catchAsync(async (req, res) => {
        const posts = await postService.get({ status: 'success' });
        res.render('client/post', {
            title: 'Điểm rèn luyện',
            posts,
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
            .create({ ...req.body, author: user._id, status: 'pending' })
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
        const user = req.cookies.user;
        const post = await postService.getOne({ _id: id });
        console.log(user, post);
        if (!user || !post) {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('/profile');
        }
        await postService.delete({ _id: id }).catch((err) => {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('/profile');
        });
        req.flash('success', 'Xoá bài viết thành công');
        res.redirect('/profile');
    }),
};

module.exports = postController;
