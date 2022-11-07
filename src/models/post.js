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
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'success'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model('Post', Post);
