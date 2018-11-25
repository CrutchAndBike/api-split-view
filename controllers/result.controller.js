const Result = require('../models/Result');

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
        } catch {
            res.status(400).json(err);
        }
    },

    getAnal: async (req, res) => {
        const { pollId } = req.query;

        try {
            if (pollId) {
                const resultsCount = await Result.find({ poll: pollId }).count();
                // TODO доделать аналитику: возвращать % ответов за каждый вариант
                res.json({ count: resultsCount });
            } else {
                res.status(400).send({ err: 'Missing required fields' });
            }
        } catch (err) {
            res.status(400).json(err);
        }
    },

    save: async (req, res) => {
        const { authorId, selectedVariantId, pollId } = req.body;

        try {
            if (authorId && selectedVariantId && pollId) {
                const newResult = await Result({
                    author: authorId,
                    selectedVariant: selectedVariantId,
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