const { Schema, model } = require('mongoose');

const Market = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        phone: String,
        images: [String],
        status: {
            type: String,
            enum: ['pending', 'success'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model('Market', Market);
