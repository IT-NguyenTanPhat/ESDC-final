const catchAsync = require('../utils/catchAsync');

const calendarController = {
    index: (req, res) => {
        res.render('client/calendar', {
            title: 'Lịch kiểm tra',
            user: req.cookies.user,
        });
    },
};

module.exports = calendarController;
