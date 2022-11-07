const catchAsync = require('../utils/catchAsync');

const tradeController = {
    index: (req, res) => {
        res.render('client/trade', {
            title: 'Mua & bán',
            user: req.cookies.user,
        });
    },
};

module.exports = tradeController;
