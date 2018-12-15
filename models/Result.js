const mongoose = require('../lib/connect');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
	// Дата создания
	createdOn: {
		type: Date,
		required: true,
		default: new Date()
	},
	// Автор
	author: {
		type: ObjectId,
		ref: 'User'
	},
	// Выбранный вариант
	selectedVariant: {
		type: Number,
		required: true
	},
	// Id опроса
	poll: {
		type: Schema.Types.ObjectId,
		ref: 'Poll',
		required: true
	},
	forms: {
		type: [Object]
	}
});

const result = mongoose.model('Result', schema);
module.exports = result;
