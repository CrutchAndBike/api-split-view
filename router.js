const { Poll, Result, User, Auth } = require('./controllers');

const { validateMongoId } = require('./middleware/validator');
const { checkSession } = require('./middleware/checkSession');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.json({title: 'Express'});
    });

    // Authorization
    app.get('/login/yandex', Auth.loginYandex);

    app.use(checkSession);

    app.get('/logout', Auth.logout);

    // Poll

    app.get('/api/poll', Poll.getAll);

    app.get('/api/poll/:id', validateMongoId, Poll.getOne);

    app.put('/api/poll/:id', validateMongoId, Poll.edit);

    app.post('/api/poll', Poll.create);

    app.patch('/api/poll/:id', validateMongoId, Poll.changeStatus);

    app.delete('/api/poll/:id', validateMongoId, Poll.delete);

    // Result

    app.get('/api/results', Result.getAll);

    app.get('/api/analytic-result', Result.getAnal);

    app.post('/api/insert-result', Result.save);

    // User
    
    app.get('/api/users', User.getAll);

    app.get('/api/users/:id', validateMongoId, User.getOne);

    app.post('/api/users', User.create);

    app.put('/api/users/:id', validateMongoId, User.edit);

    app.delete('/api/users/:id', validateMongoId, User.delete);
    
}