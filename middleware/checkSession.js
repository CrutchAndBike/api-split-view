const User = require('../models/User');

const checkSession = async (req, res, next) => {

	if (req.url === '/login/yandex') {
		return next();
	} else if (req.session.user_id) {
		try {
			let user = await User.findById(req.session.user_id);
			if (user) {
				return next();
			}
		} catch (err) {
			console.log(err);
		}
	} else {
		return res.status(401).json({ error: 'Unauthorized' });
	}

};

module.exports = {
	checkSession
};
