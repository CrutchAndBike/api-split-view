const mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    options: [String]
});

const input = mongoose.model('Input', schema);
module.exports = input;
