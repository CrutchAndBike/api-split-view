module.exports.controller = (app) => {
    app.get('/', (req, res) => {
        res.render('index', {title: 'Express'});
    });
};