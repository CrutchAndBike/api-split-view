const createError = require('http-errors');
const express = require('express');
const app = express();
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); 
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

require('./lib/connect'); // Connect to DB

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
    secret: 'some-secret-key',
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'native',
        ttl: 14 * 24 * 60 * 60,
        touchAfter: 10 * 60,
        stringify: true
    })
}));

// Include controllers
fs.readdirSync('controllers').forEach((file) => {
    if (file.substr(-3) === '.js') {
        let route = require('./controllers/' + file);
        route.controller(app);
    }
});

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
    res.sendStatus(err.status || 500);
});

module.exports = app;
