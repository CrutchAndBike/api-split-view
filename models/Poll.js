const mongoose = require('../lib/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    author: String, // TODO: Rel to user model
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'wait' // wait, active, closed,
    },
    name: {
        type: String,
        required: true
    },
    forms: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Input'
            }
        ]
    },
    questions: {
        type: [String], //TODO: Rel to question
        // required: true
    }
});

const poll = mongoose.model('Poll', schema);
module.exports = poll;