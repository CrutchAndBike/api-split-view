const mongoose = require('../lib/connect');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    author: {
        type: ObjectId,
        ref: 'User'
        // required: true
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
        type: [Object]
    },
    variant: {
        a: {
            type: String,
            required: true
        },
        b: {
            type: String,
            required: true
        }
    }
});

const poll = mongoose.model('Poll', schema);
module.exports = poll;