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
		default: 'wait' // wait, active, close
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
			buttonCaption: {
				type: String
			},
			value: {
				type: String,
				required: true
			}
		},
		b: {
			buttonCaption: {
				type: String
			},
			value: {
				type: String,
				required: true
			}
		}
	}
});

const poll = mongoose.model('Poll', schema);
module.exports = poll;