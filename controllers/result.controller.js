const Result = require('../models/Result');
const Poll = require('../models/Poll');

module.exports = {

    getAll: async (req, res) => {
        const limitFilter = req.query.limit && parseInt(req.query.limit);
        const offsetFilter = req.query.offset && parseInt(req.query.offset);

        try {
            let results = await Result.find({ poll: req.query.poll }, 'creatdOn poll selectedVariant author');
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

    getAnal: async (req, res) => {
        const { authorId, status, limitFilter, offsetFilter } = req.body;
        let results = [];

        try {
            // TODO add required check 'author'
            const polls = await Poll.find(
                {
                    status: {
                        '$in': status
                    },
                    author: authorId
                },
                '_id status name'
            );
            if (polls.length) {
                for (let i = 0; i < polls.length; i++) {
                    results.push({
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
        const { authorId, selectedVariant, pollId } = req.body;

        try {
            if (authorId && selectedVariant && pollId) {
                const newResult = await Result({
                    author: authorId,
                    selectedVariant: selectedVariant,
                    poll: pollId
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