const createError = require('http-errors');
const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('./lib/connect');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const { checkSession } = require('./middleware/checkSession');

const router = require('./router');

const isDev = process.env.NODE_ENV === 'development';
require('dotenv').config();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session
app.use(session({
	name: 'api-split-view',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 14 * 24 * 60 * 60 * 1000 // 2 weeks
	},
	unset: 'destroy',
	secret: process.env.SESSION_SECRET || '',
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		autoRemove: 'native',
		ttl: 14 * 24 * 60 * 60,
		touchAfter: 10 * 60,
		stringify: true
	})
}));

isDev || app.use(checkSession);

router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	console.error(err);
	res.sendStatus(err.status || 500);
});

module.exports = app;
