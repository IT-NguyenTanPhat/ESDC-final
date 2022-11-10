const catchAsync = require('../utils/catchAsync');
const { marketService } = require('../services');

const marketController = {
    index: catchAsync(async (req, res) => {
        const posts = await marketService.get({
            status: 'success',
            content: { $regex: req.query.search || '', $options: 'i' },
        });
        res.render('client/post', {
            title: 'Điểm rèn luyện',
            posts,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        if (!user || !req.body.phone) {
            req.flash('error', 'Đăng bài viết thất bại');
            return res.redirect('/profile');
        }
        const images = req.body.images.split(' ');
        images.pop();
        await marketService
            .create({
                ...req.body,
                images,
                author: user._id,
                status: 'pending',
            })
            .catch((err) => {
                req.flash('error', 'Đăng bài viết thất bại');
                return res.redirect('/profile');
            });
        req.flash('success', 'Đăng bài viết thành công');
        res.redirect('/profile');
    }),

    update: catchAsync(async (req, res) => {
        const { phone, id } = req.body;
        const post = await marketService.getOne({ _id: id });
        if (!phone || !post) {
            req.flash('error', 'Cập nhật bài viết thất bại');
            return res.redirect('/profile');
        }
        let images = post.images;
        if (req.body.images) {
            images = req.body.images.split(' ');
            images.pop();
        }
        await marketService
            .update({ _id: id }, { ...req.body, images })
            .catch((err) => {
                req.flash('error', 'Cập nhật bài viết thất bại');
                return res.redirect('/profile');
            });
        req.flash('success', 'Cập nhật bài viết thành công');
        res.redirect('/profile');
    }),

    censor: catchAsync(async (req, res) => {
        const { id } = req.body;
        const post = await marketService.getOne({ _id: id });
        if (!post) {
            req.flash('error', 'Duyệt bài viết thất bại');
            return res.redirect('/admin/market');
        }
        await marketService
            .update({ _id: id }, { status: 'success' })
            .catch((err) => {
                req.flash('error', 'Duyệt bài viết thất bại');
                return res.redirect('/admin/market');
            });
        req.flash('success', 'Duyệt bài viết thành công');
        res.redirect('/admin/market');
    }),

    delete: catchAsync(async (req, res) => {
        const { id } = req.body;
        const post = await marketService.getOne({ _id: id });
        if (!post) {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('back');
        }
        await marketService.delete({ _id: id }).catch((err) => {
            req.flash('error', 'Xoá bài viết thất bại');
            return res.redirect('back');
        });
        req.flash('success', 'Xoá bài viết thành công');
        res.redirect('back');
    }),
};

module.exports = marketController;
