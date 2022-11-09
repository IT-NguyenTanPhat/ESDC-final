const { courseModel } = require('../models');

const courseService = {
    getOne: async (payloads, field) => {
        const res = await courseModel
            .findOne(payloads, field)
            .populate('author')
            .lean();
        return res;
    },

    get: async (payloads, field) => {
        const res = await courseModel
            .find(payloads, field)
            .populate('author')
            .lean();
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
