const Result = require('../models/Result');
const Poll = require('../models/Poll');

const inputTypes = ['select', 'text'];

class Input {
	constructor(data) {
		this.text = data.text;
		this.value = data.value;
		this.type = data.type;

		if (this.type === 'select') {
			this.options = data.options;
		}
	}
}

function isValidForm(input) {
	const hasText = !!input.text;
	const hasType = !!input.type;
	const hasValue = !!input.value;

	if (!hasText || !hasType || !hasValue) {
		return false;
	}

	const typeOk = inputTypes.includes(input.type);

	if (!typeOk) {
		return false;
	} 

	const hasOptions = input.options && input.options != 0;

	if (input.type == 'select' && !hasOptions) {
		return false;
	}
    
	return true;
}

module.exports = {

	getAll: async (req, res) => {
		const limitFilter = req.query.limit && parseInt(req.query.limit);
		const offsetFilter = req.query.offset && parseInt(req.query.offset);
		try {
			let results = await Result.find({ poll: req.query.poll }, 'creatdOn poll selectedVariant author forms');
			if (offsetFilter || limitFilter) {
				const start = offsetFilter ? offsetFilter : 0;
				const end = limitFilter ? start + limitFilter : undefined;
				results = results.slice(start, end);
			}
			res.json(results);
		} catch (err) {
			res.status(400).json(err);
		}
	},

	getDetailedAnalyic: async (req, res) => {
		const pollId = req.params.id;
		try {
			const results = await Result.find({poll: pollId},
				'selectedVariant createdOn forms');
			res.json(results);
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	getBaseAnalytic: async (req, res) => {
		const { status, limitFilter, offsetFilter } = req.body;
		const { user_id } = req.session;
		let results = [];

		try {
			// TODO add required check 'author'
			const polls = await Poll.find(
				{
					status: {
						'$in': status
					},
					author: user_id
				},
				'_id status name'
			);
			if (polls && polls.length) {
				for (let i = 0; i < polls.length; i++) {
					results.push({
						pollId: polls[i]._id,
						name: polls[i].name,
						status: polls[i].status,
						firstOptionCount: await Result.find(
							{
								poll: polls[i]._id,
								selectedVariant: 1
							}
						).countDocuments(),
						secondOptionCount: await Result.find(
							{
								poll: polls[i]._id,
								selectedVariant: 2
							}
						).countDocuments(),
					});
				}
			}

			if (offsetFilter || limitFilter) {
				const start = offsetFilter ? offsetFilter : 0;
				const end = limitFilter ? start + limitFilter : undefined;
				results = results.slice(start, end);
			}
      
			res.json(results);
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	save: async (req, res) => {
		const { user_id } = req.session;
		const { selectedVariant, pollId, forms } = req.body;

		const inputsForm = [];
		// The answer may be without form
		if (forms && forms.length) {
			for (let i = 0; i < forms.length; i++) {
				const input = forms[i];
				if (!isValidForm(input)) {
					res.sendStatus(400);
					return;
				}
				inputsForm.push(new Input(input));
			}
		}

		try {
			if (user_id && selectedVariant && pollId) {
				const newResult = await Result({
					author: user_id,
					selectedVariant: selectedVariant,
					poll: pollId,
					forms: inputsForm
				});
				await newResult.save();
				res.status(200).send({ msg: 'OK' });
			} else {
				res.status(400).send({ err: 'Missing required fields' });
			}
		} catch (err) {
			res.status(400).json(err);
		}
	}
};