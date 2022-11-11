const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect(
			'mongodb+srv://esdc-final:123@cluster0.cxt1omk.mongodb.net/?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log('Connect db successfully');
	} catch (error) {
		console.log('Fail to connect db');
	}
}

module.exports = { connect };
