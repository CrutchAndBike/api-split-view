const createError = require('http-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const router = require('./router');

require('./lib/connect'); // Connect to DB

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

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
    res.sendStatus(err.status || 500);
});

module.exports = app;
