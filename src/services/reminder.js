const cron = require('node-cron');
const { reminderModel } = require('../models');
const mailService = require('./email');

const getCurrentDateHour = () => {
	const dateObj = new Date();
	const hour = dateObj.getHours();
	const date = `${dateObj.getFullYear()}-${
		dateObj.getMonth() + 1
	}-${dateObj.getDate()}`;

	const currentDateHour = new Date(date);
	currentDateHour.setHours(hour);
	currentDateHour.setDate(currentDateHour.getDate() + 2);

	return currentDateHour;
};

const ReminderService = {
	get: async (payloads, field) => {
		return await reminderModel.findOne(payloads, field).lean();
	},

	getByNow: async (fields) => {
		const currentDateHour = getCurrentDateHour();

		return await reminderModel.find({ date: currentDateHour }, fields).lean();
	},

	create: async (payloads) => {
		return await reminderModel.create(payloads);
	},

	update: async (conditions, payloads) => {
		return await reminderModel.findOneAndUpdate(conditions, payloads, {
			runValidators: true,
			new: true,
		});
	},

	delete: async (id) => {
		return await reminderModel.findOneAndDelete({ _id: id });
	},

	start: function () {
		cron.schedule('0 * * * *', async () => {
			const reminders = await this.getByNow('email content _id');

			reminders.forEach(async ({ email, content, _id }) => {
				await mailService.sendMail({
					to: email,
					subject: 'An important event within the next 2 days',
					content: `<p>Your Reminder: ${content}</p>`,
				});

				await this.delete({ _id });
			});
		});
	},
};

module.exports = ReminderService;
