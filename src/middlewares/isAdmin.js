module.exports = (req, res, next) => {
    const user = req.cookies.user;

    if (user.role == 'user') {
        return res.render('error', { layout: false });
    }
    next();
};
