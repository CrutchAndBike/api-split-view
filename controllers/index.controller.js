module.exports.controller = (app) => {
    app.get('/', (req, res) => {
        res.json({title: 'Express'});
    });
};
