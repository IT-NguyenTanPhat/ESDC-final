const { Schema: _Schema, model } = require('mongoose');
const Schema = _Schema;

const Denounced = new Schema(
	{
		reporter: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		reason: String,
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('Denounce', Denounced);
