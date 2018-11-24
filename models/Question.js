const mongoose = require('../lib/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    variant: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Variant'
            }
        ],
        required: true
    }
});

const question = mongoose.model('Question', schema);
module.exports = question;
