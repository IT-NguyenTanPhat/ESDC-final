const formidable = require('formidable');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const { marketService } = require('../services');

const handleImageList = (images) => {
    if (!images.length) {
        if (images.size == 0) return [];
        const { filepath, mimetype } = images;
        const data = fs.readFileSync(filepath, { encoding: 'base64' });
        return [`data:${mimetype};base64, ${data}`];
    }
    return images.map((image) => {
        const { filepath, mimetype } = image;
        const data = fs.readFileSync(filepath, { encoding: 'base64' });
        return `data:${mimetype};base64, ${data}`;
    });
};

const marketController = {
    index: catchAsync(async (req, res) => {
        const posts = await marketService.get({
            status: 'success',
            content: { $regex: req.query.search || '', $options: 'i' },
        });
        res.render('client/market', {
            title: 'Mua & bán',
            posts,
            user: req.cookies.user,
        });
    }),

    create: catchAsync(async (req, res) => {
        const user = req.cookies.user;
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }

            const { content, phone } = fields;
            const images = files.images;
            if (!user || !content || !phone) {
                req.flash('error', 'Đăng bài viết thất bại');
                return res.redirect('/profile');
            }

            await marketService
                .create({
                    ...fields,
                    images: handleImageList(images),
                    author: user._id,
                })
                .catch((err) => {
                    req.flash('error', 'Đăng bài viết thất bại');
                    return res.redirect('/profile');
                });
            req.flash('success', 'Đăng bài viết thành công');
            res.redirect('/profile');
        });
    }),

    update: catchAsync(async (req, res) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }

            const { phone, id } = fields;
            const post = await marketService.getOne({ _id: id });
            if (!phone || !post) {
                req.flash('error', 'Cập nhật bài viết thất bại');
                return res.redirect('/profile');
            }

            await marketService
                .update(
                    { _id: id },
                    { ...fields, images: handleImageList(files.images) }
                )
                .catch((err) => {
                    req.flash('error', 'Cập nhật bài viết thất bại');
                    return res.redirect('/profile');
                });
            req.flash('success', 'Cập nhật bài viết thành công');
            res.redirect('/profile');
        });
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
