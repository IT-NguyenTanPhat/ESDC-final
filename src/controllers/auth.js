const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { userService, redisService, emailService } = require('../services');

const authController = {
    // GET /auth/login
    loginView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/login', { title: 'Đăng nhập', layout: 'auth', error });
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
            if (user.status === 'banned') {
                req.flash('error', 'Tài khoản này đã bị khóa');
                return res.redirect('/auth/login');
            }

            jwt.sign(
                { email, id: user._id },
                '123',
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        req.flash('error', 'Đăng nhập thất bại');
                        return res.redirect('/auth/login');
                    } else {
                        res.cookie('AuthToken', token);
                        res.cookie('user', user);
                        if (user.role == 'admin') return res.redirect('/admin');
                        return res.redirect('/');
                    }
                }
            );
        } else {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            res.redirect('/auth/login');
        }
    }),

    // GET /auth/register
    registerView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/register', {
            title: 'Đăng ký',
            layout: 'auth',
            error,
        });
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
        await userService.create({ ...req.body, role: 'user' }).catch((err) => {
            req.flash('error', 'Đăng ký thất bại!');
            return res.redirect('/auth/register');
        });
        res.redirect('/auth/login');
    }),

    changePasswordView: (req, res, next) => {
        const error = req.flash('error');
        res.render('auth/change', {
            title: 'Đổi mật khẩu',
            layout: 'auth',
            error,
        });
    },

    changePassword: catchAsync(async (req, res, next) => {
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        if (!currentPassword || !newPassword || !passwordConfirm) {
            req.flash('error', 'Đổi mật khẩu thất bại');
            return res.redirect('/auth/change-password');
        }

        if (!(await bcrypt.compare(currentPassword, req.user.password))) {
            req.flash('error', 'Sai mật khẩu');
            return res.redirect('/auth/change-password');
        }

        if (passwordConfirm !== newPassword) {
            req.flash('error', 'Mật khẩu không trùng khớp');
            return res.redirect('/auth/change-password');
        }

        await userService.update(
            {
                _id: req.user._id,
            },
            {
                password: await bcrypt.hash(newPassword, 12),
                passwordChangedAt: Date.now(),
            }
        );

        next();
    }),

    // GET /auth/logout
    logout: (req, res) => {
        const { token } = req.tokenData;
        // get token eat to set redis expiration
        redisService.set(`bl_${token}`, token);

        res.clearCookie('AuthToken');
        res.clearCookie('user');
        res.redirect('/auth/login');
    },

    // GET /auth/forgot-password
    forgotPasswordView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/forgot', {
            title: 'Quên mật khẩu',
            layout: 'auth',
            error,
        });
    },

    // POST /auth/forgot-password
    forgotPassword: catchAsync(async (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            req.flash('error', 'Email không khả dụng');
            return res.redirect('/auth/forgot-password');
        }
        const user = await userService.getOne({ email });
        if (!user) {
            req.flash('error', 'Email không khả dụng');
            return res.redirect('/auth/forgot-password');
        }

        if (user.status === 'banned') {
            req.flash('error', 'Tài khoản đã bị vô hiệu hoá');
            return res.redirect('/auth/login');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        redisService.set(`rs_${hashedResetToken}`, user._id.toString(), {
            EX: 300,
        });

        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/auth/reset-password/${resetToken}`;

        await emailService.sendMail({
            to: email,
            subject: 'Cấp lại mật khẩu',
            content: `<p>Click vào đường dẫn để được cấp lại mật khẩu.</p><br><a href="${resetURL}">${resetURL}</a>`,
        });
    }),

    // GET /auth/reset-password/:token
    resetPasswordView: catchAsync(async (req, res) => {
        const resetToken = req.params.token;

        if (!resetToken) {
            req.flash('error', 'Có lỗi xảy ra');
            return res.redirect('/auth/login');
        }

        const hashedResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const userId = await redisService.get(`rs_${hashedResetToken}`);
        if (!userId) {
            req.flash('error', 'Có lỗi xảy ra');
            return res.redirect('/auth/login');
        }

        global.userId = userId;
        res.render('auth/reset', { title: 'Tạo mật khẩu mới', layout: 'auth' });
    }),

    // POST /auth/reset-password
    resetPassword: catchAsync(async (req, res, next) => {
        const { password, passwordConfirm } = req.body;

        if (!password || !passwordConfirm || password != passwordConfirm) {
            req.flash('error', 'Có lỗi xảy ra');
            return res.redirect('/auth/login');
        }

        await userService.update(
            {
                _id: global.userId,
            },
            {
                password: await bcrypt.hash(password, 12),
                passwordChangedAt: Date.now(),
            }
        );

        res.redirect('/auth/login');
    }),
};

module.exports = authController;
