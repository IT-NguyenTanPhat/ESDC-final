const { Schema, model } = require('mongoose');

const Post = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        url: {
            type: String,
            required: true,
        },
        answerUrl: String,
        description: {
            type: String,
        },
        isSpam: {
            type: Boolean,
            default: false,
        },
        dueTo: Date,
        faculty: String,
        status: {
            type: String,
            enum: ['pending', 'success'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model('Post', Post);
