const cron = require('node-cron');
const { courseModel } = require('../models');
const mailService = require('./email');

const getCurrentDateHour = () => {
	const dateObj = new Date();
	const hour = dateObj.getHours();
	const date = `${dateObj.getFullYear()}-${
		dateObj.getMonth() + 1
	}-${dateObj.getDate()}`;

	const currentDateHour = new Date(date);
	currentDateHour.setHours(hour);
	currentDateHour.setDate(currentDateHour.getDate());

	return currentDateHour;
};

const courseService = {
    getByNow: async (fields) => {
      const currentDateHour = getCurrentDateHour();

      const users = await courseModel.aggregate([
        { $unwind: '$examinations' },
        { $match: { 'examinations.time': currentDateHour } },
        { $project: { author: 1, examinations: 1 } },
      ]);

      return await courseModel.populate(users, {
        path: 'author',
        select: 'email',
      });
    },

    startExamReminderScheduler: function () {
      // test xong sửa lại thành '0 * * * *'
      // '*/30 * * * * *' -> 30s chạy 1 lần
      cron.schedule('*/10 * * * * *', async () => {
        const reminders = await this.getByNow();
        console.log('run');
        reminders.forEach(async (reminder) => {
          const email = reminder.author.email;
          const { title, content, _id: reminderId } = reminder.examinations;

          await mailService.sendMail({
            to: email,
            subject: 'An important event within the next 2 days',
            content: `<p>Your Reminder: ${content}</p><br><p>${title}</p`,
          });

          await this.update(
            { _id: reminder._id },
            { $pull: { examinations: { _id: reminderId } } }
          );
        });
      });
    },

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
