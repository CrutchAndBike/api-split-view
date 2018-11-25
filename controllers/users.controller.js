const User = require('../models/User');
const passport = require('passport');

module.exports.controller = (app) => {

    // get all users
    app.get('/api/users', async (req, res) => {

        const limitFilter = req.query.limit && parseInt(req.query.limit);
        const offsetFilter = req.query.offset && parseInt(req.query.offset);

        try {
            let users = await User.find({}, 'name age gender');

            if (offsetFilter || limitFilter) {
                const start = offsetFilter ? offsetFilter : 0;
                console.log(start);
                const end = limitFilter > 0 ? start + limitFilter : undefined;
                users = users.slice(start, end);
            }
            res.json(users);

        } catch (error) {
            res.status(400).json(error);
        }
    });

    // get single user by id
    app.get('/api/users/:id', async (req, res) => {
        try {
            let user = await User.findById(req.params.id, 'name age gender');
            res.json(user);
        } catch (error) {
            res.status(400).json(error);
        }
    });

    // add new user
    app.post('/api/users', async (req, res) => {
        const user = new User({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            avatar: req.body.avatar,
            isAdmin: req.body.isAdmin
        });

        try {
            let response = await user.save(user);
            res.json(response._id);
        } catch (error) {
            res.status(400).json(error);
        }
    });

    // update existing user
    app.put('/api/users/:id', async (req, res) => {
        try {
            let response = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                    avatar: req.body.avatar,
                    isAdmin: req.body.isAdmin
                }
            });
            res.json(response._id);
        } catch (error) {
            res.status(400).json(error);
        }
    });

    // delete existing user
    app.delete('/api/users/:id', async (req, res) => {
        try {
            let response = await User.findByIdAndRemove(req.params.id);
            res.json(response._id);
        } catch (error) {
            res.status(400).json(error);
        }
    });

    // authorizatoin
    app.get('/auth/yandex', passport.authenticate('yandex'));

    // yandex auth callback
    app.get('/auth/yandex/callback',
        passport.authenticate('yandex', { failureRedirect: './login'}), // redirect to login page
        (req, res) => { 
            res.json({});
        });


};
