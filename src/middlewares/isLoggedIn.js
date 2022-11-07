const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.path.includes('/auth')) return next();
    const token = req.cookies.AuthToken;
    if (!token) {
        res.status(403);
        req.flash('error', 'Vui lòng đăng nhập.');
        return res.redirect('/auth/login');
    }

    jwt.verify(token, '123', (err, data) => {
        if (err) {
            res.status(403);
            req.flash('error', 'Vui lòng đăng nhập.');
            return res.redirect('/auth/login');
        }
        next();
    });
};
