const createError = require('http-errors');
const express = require('express');
const app = express();
const fs = require('fs');
const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;

const bodyParser = require('body-parser');

const YANDEX_CLIENT_ID = '';
const YANDEX_CLIENT_SECRET = '';

require('./lib/connect'); // Connect to DB

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// Include controllers
fs.readdirSync('controllers').forEach((file) => {
    if (file.substr(-3) === '.js') {
        let route = require('./controllers/' + file);
        route.controller(app);
    }
});

// passport
passport.use(new YandexStrategy({
        clientID: YANDEX_CLIENT_ID,
        clientSecret: YANDEX_CLIENT_SECRET,
        callbackURL: 'http://127.0.0.1:3001/auth/yandex/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);
    }
));

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
