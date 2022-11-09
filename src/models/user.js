const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const User = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordChangedAt: {
		type: Date,
		default: undefined,
	},
	bannedAt: {
		type: Date,
		default: undefined,
	},
	status: {
		type: String,
		enum: ['active', 'banned'],
		default: 'active',
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});

User.pre('save', async function (next) {
	// 12 is salt length
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

module.exports = model('User', User);
