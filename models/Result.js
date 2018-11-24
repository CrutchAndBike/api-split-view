const mongoose = require('../lib/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    // Дата создания
    createdOn: {
        type: Date,
        required: true
    },
    // Дата изменения
    modifiedOn: {
        type: Date,
        required: true
    },
    // Автор
    author: {
        type: String, 
        /* TODO поменять на уник. идентификатоор
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Users'
            }
        ],
        */
        required: true
    },
    // Выбранный вариант
    selectedVariant: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Variant'
            }
        ],
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
