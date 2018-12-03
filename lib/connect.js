const mongoose = require('mongoose');
const { user, pass, host, name } = require('../conf/db');

const uri = `mongodb://${user}:${pass}@${host}/${name}`;
const options = {
	useNewUrlParser: true,
	useFindAndModify: false
};

mongoose.connect(uri, options);

const db = mongoose.connection;

db.on('error', function (err) {
	console.error('Database connection error:', err);
	process.exit(0);
});

db.once('open', function () {
	console.log('Database connection Ok!');
});

module.exports = mongoose;
