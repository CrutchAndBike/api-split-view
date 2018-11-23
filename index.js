const express = require('express');
const app = express();

const router = require('./router');
const bodyParser = require('body-parser');

const {port} = require('./conf/server');

require('./lib/connect'); // Connect to DB

app.use(bodyParser.urlencoded({extended: false}));

router(app);

app.use('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(port, function () {
    console.log(`Server listening on port ${port}!`);
});