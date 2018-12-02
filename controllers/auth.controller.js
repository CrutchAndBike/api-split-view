const User = require('../models/User');
const axios = require('axios');

module.exports = {
	loginYandex: async (req, res) => {
		const token = req.headers.authorization;

		try {
			const data = await axios.get('https://login.yandex.ru/info?format=json', {
				headers: {
					'Authorization': 'OAuth ' + token
				}
			});
			const userData = data.data;

			let user = await User.findOne({ yandex_id: userData.id });

			if(!user) {
				user = new User({
					name: userData.real_name,
					age: '',
					gender: userData.sex,
					avatar: '',
					yandex_id: userData.id,
				});
				let response = await user.save(user);

				req.session.user_id = response._id;
				res.json(response);
			} else {
				req.session.user_id = user._id;
				res.json(user);
			}
		} catch (error) {
			console.log(error);
			res.status(400).json(error);
		}
	},

	logout: (req, res) => {
		req.session.destroy();
		res.clearCookie('api-split-view').json({});
	}
};
