const mongoose = require('../lib/connect'),
	Schema = mongoose.Schema;


const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Let us know you by adding your name!']
	},
	gender: String,
	age: Number,
	avatar: String,
	yandex_id: String
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
