const mongoose = require('../lib/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    // Дата создания
    createdOn: {
        type: Date,
        required: true,
        default: new Date()
    },
    // Автор
    author: {
        type: String,
        /* TODO поменять на уник. идентификатор
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        */
        required: true
    },
    // Выбранный вариант
    selectedVariant: {
        /* TODO поменять на уник. идентификатор
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Variant'
            }
        ],
        */
        type: String,
        required: true
    },
    // Id опроса
    poll: {
        type: String,
        /* TODO поменять на уник. идентификатоор
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Poll'
            }
        ],
        */
        required: true
    }
});

const result = mongoose.model('Result', schema);
module.exports = result;
