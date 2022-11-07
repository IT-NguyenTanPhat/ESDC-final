const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userService } = require('../services');

const authController = {
    // GET /auth/login
    loginView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/login', { title: 'Đăng nhập', layout: false, error });
    },

    // POST /auth/login
    login: catchAsync(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            return res.redirect('/auth/login');
        }
        const user = await userService.getOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            jwt.sign({ email }, '123', { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    req.flash('error', 'Đăng nhập thất bại');
                    return res.redirect('/auth/login');
                } else {
                    res.cookie('AuthToken', token);
                    res.cookie('user', user);
                    if (user.role == 'admin') return res.redirect('/admin');
                    return res.redirect('/');
                }
            });
        } else {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            res.redirect('/auth/login');
        }
    }),

    // GET /auth/register
    registerView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/register', { title: 'Đăng ký', layout: false, error });
    },

    // POST /auth/register
    register: catchAsync(async (req, res) => {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            return res.redirect('/auth/register');
        }
        const user = await userService.getOne({ email });
        if (user) {
            req.flash('error', 'Tên đăng nhập đã tồn tại!');
            return res.redirect('/auth/register');
        }
        await userService.create({ ...req.body, role: 'user' }).catch(err => {
            req.flash('error', 'Đăng ký thất bại!');
            return res.redirect('/auth/register');
        });
        res.redirect('/auth/login');
    }),

    // GET /auth/logout
    logout: (req, res) => {
        res.clearCookie('AuthToken');
        res.clearCookie('user');
        res.redirect('/auth/login');
    },
};

module.exports = authController;
