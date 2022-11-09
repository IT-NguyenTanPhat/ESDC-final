const catchAsync = require('../utils/catchAsync');

const tradeController = {
    index: (req, res) => {
        res.render('client/market', {
            title: 'Mua & bán',
            user: req.cookies.user,
        });
    },
};

module.exports = tradeController;
