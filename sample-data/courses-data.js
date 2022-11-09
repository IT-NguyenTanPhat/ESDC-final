// offset here is number of days before the exam you want the system to send mail
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

module.exports = [
	{
		name: 'XSTK',
		author: '636b5eecac004120c2b54f2d',
		examinations: [
			{
				title: 'Midterm 1',
				content: 'Reminder of Thanh 1',
				time: getCurrentDateHour(),
			},
			{
				title: 'Midterm 1',
				content: 'Reminder of Thanh 2',
				time: '2022-11-09T10:00:00.000Z',
			},
		],
	},
	{
		name: 'XSTK',
		author: '636b5eecac004120c2b54f2e',
		examinations: [
			{
				title: 'Midterm 1',
				content: 'Reminder of Tín 1',
				time: getCurrentDateHour(),
			},
			{
				title: 'Midterm 1',
				content: 'Reminder of Tín 2',
				time: getCurrentDateHour(),
			},
		],
	},
];
