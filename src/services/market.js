const { marketModel } = require('../models');

const marketService = {
    getOne: async (payloads, field) => {
        const res = await marketModel
            .findOne(payloads, field)
            .populate('author')
            .lean();
        res.updatedAt = res.updatedAt.toLocaleString('vi-VN');
        return res;
    },

    get: async (payloads, field) => {
        const res = await marketModel
            .find(payloads, field)
            .populate('author')
            .lean();
        res.map((item) => {
            item.updatedAt = item.updatedAt.toLocaleString('vi-VN');
        });
        return res;
    },

    create: async (payloads) => {
        return await marketModel.create(payloads);
    },

    update: async (conditions, payloads) => {
        return await marketModel.findOneAndUpdate(conditions, payloads, {
            runValidators: true,
        });
    },

    delete: async (conditions) => {
        return await marketModel.findOneAndDelete(conditions);
    },
};

module.exports = marketService;
