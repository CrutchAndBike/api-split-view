const User = require('../models/User');

module.exports = {

	getAll: async (req, res) => {
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
	},

	getOne: async (req, res) => {
		try {
			let user = await User.findById(req.params.id, 'name age gender');
			res.json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	},

	create: async (req, res) => {
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
	},

	edit: async (req, res) => {
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
	},

	delete: async (req, res) => {
		try {
			let response = await User.findByIdAndRemove(req.params.id);
			res.json(response._id);
		} catch (error) {
			res.status(400).json(error);
		}
	}
};
