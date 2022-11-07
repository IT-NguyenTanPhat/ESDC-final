const { userModel } = require('../models');

const userService = {
	getOne: async (payloads, field) => {
		return await userModel.findOne(payloads, field).lean();
	},

    get: async (payloads, field) => {
		return await userModel.find(payloads, field).lean();
	},

	create: async (payloads) => {
		return await userModel.create(payloads);
	},

	update: async (conditions, payloads) => {
		return await userModel.findOneAndUpdate(conditions, payloads, {
			runValidators: true,
		});
	},

	delete: async (conditions) => {
		return await userModel.findOneAndDelete(conditions);
	},
};

module.exports = userService;
