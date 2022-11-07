const catchAsync = require('../utils/catchAsync');

const courseController = {
    index: (req, res) => {
        res.render('client/index', {
            title: 'Trang chủ',
            user: req.cookies.user,
        });
    },
};

module.exports = courseController;
