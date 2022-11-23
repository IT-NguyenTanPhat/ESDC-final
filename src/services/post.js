const { postModel } = require('../models');

const postService = {
    getOne: async (payloads, field) => {
        const res = await postModel
            .findOne(payloads, field)
            .populate('author')
            .lean();
        res.updatedAt = res.updatedAt.toLocaleString('vi-VN');
        res.dueTo = res.dueTo.toLocaleDateString('vi-VN');
        return res;
    },

    get: async (payloads, field) => {
        const res = await postModel
            .find(payloads, field)
            .populate('author')
            .lean();
        res.map((item) => {
            item.updatedAt = item.updatedAt.toLocaleString('vi-VN');
            item.dueTo = item.dueTo.toLocaleDateString('vi-VN');
        });
        return res;
    },

    create: async (payloads) => {
        return await postModel.create(payloads);
    },

    update: async (conditions, payloads) => {
        return await postModel.findOneAndUpdate(conditions, payloads, {
            runValidators: true,
        });
    },

    delete: async (conditions) => {
        return await postModel.findOneAndDelete(conditions);
    },
};

module.exports = postService;
