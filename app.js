const createError = require('http-errors');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const cors = require('cors');
const bodyParser = require('body-parser');

const router = require('./router');

require('dotenv').config();

const mongoose = require('./lib/connect'); // Connect to DB
const { checkSession } = require('./middleware/checkSession');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));


// session
app.use(session({
    name: 'api-split-view',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 14 * 24 * 60 *60 * 1000 // 2 weeks
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

app.use(checkSession);

router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.err(err);
    res.sendStatus(err.status || 500);
});

module.exports = app;
