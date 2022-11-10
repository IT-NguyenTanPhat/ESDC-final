const { courseModel } = require('../models');

const courseService = {
    getOne: async (payloads, field, locale = true) => {
        const res = await courseModel
            .findOne(payloads, field)
            .populate('author')
            .lean();
        if (locale) {
            res.examinations.map((item) => {
                item.time = item.time.toLocaleString('vi-VN');
            });
        }
        return res;
    },

    get: async (payloads, field, locale = true) => {
        const res = await courseModel
            .find(payloads, field)
            .populate('author')
            .lean();
        if (locale) {
            res.map((item) => {
                item.examinations.map((x) => {
                    x.time = x.time.toLocaleString('vi-VN');
                });
            });
        }
        return res;
    },

    create: async (payloads) => {
        return await courseModel.create(payloads);
    },

    update: async (conditions, payloads) => {
        return await courseModel.findOneAndUpdate(conditions, payloads, {
            runValidators: true,
        });
    },

    delete: async (conditions) => {
        return await courseModel.findOneAndDelete(conditions);
    },
};

module.exports = courseService;
