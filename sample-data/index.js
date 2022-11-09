const mongoose = require('mongoose');
const { userModel, courseModel } = require('../src/models');
const users = require('./users-data');
const courses = require('./courses-data');

const importData = async () => {
	await userModel.create(users);
	await courseModel.create(courses);
};

const deleteData = async () => {
	await userModel.deleteMany();
	await courseModel.deleteMany();
};

const resetData = async () => {
	await deleteData();
	await importData();
};

(async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://esdc-final:123@cluster0.cxt1omk.mongodb.net/testdb?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);

		if (process.argv[2] === 'import') {
			await importData();
			console.log('Created successfully');
		} else if (process.argv[2] === 'delete') {
			await deleteData();
			console.log('Deleted successfully');
		} else {
			await resetData();
			console.log('Reset successfully');
		}
	} catch (err) {
		console.error(err);
	} finally {
		mongoose.disconnect();
	}
})();
