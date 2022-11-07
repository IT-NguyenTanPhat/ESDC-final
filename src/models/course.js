const { Schema, model } = require('mongoose');

const Course = new Schema({
    name: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    materials: [
        {
            name: String,
            content: String,
        },
    ],
    examinations: [
        {
            name: String,
            content: String,
            time: Date,
        },
    ],
});

module.exports = model('Course', Course);
