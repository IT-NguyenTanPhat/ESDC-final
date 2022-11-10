const { denounceModel } = require('../models');

const DenounceService = {
	getOne: async (payloads, field) => {
		return await denounceModel.findOne(payloads, field).lean();
	},

	get: async (payloads, field) => {
		return await denounceModel.find(payloads, field).lean();
	},

	create: async (payloads) => {
		return await denounceModel.create(payloads);
	},

	updateOne: async (conditions, payloads) => {
		return await denounceModel.findOneAndUpdate(conditions, payloads, {
			runValidators: true,
			new: true,
		});
	},

	update: async (conditions, payloads) => {
		return await denounceModel.updateMany(conditions, payloads, {
			runValidators: true,
			new: true,
		});
	},

	deleteOne: async (conditions) => {
		return await denounceModel.findOneAndDelete(conditions);
	},

	delete: async (conditions) => {
		return await denounceModel.deleteMany(conditions);
	},
};

module.exports = DenounceService;
