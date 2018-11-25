const Poll = require('../models/Poll');
const Input = require('../models/Input');

module.exports = {

    getAll: async (req, res) => {
        const polls = await Poll.find();

        res.json(polls);
    },

    getOne: async (req, res) => {
        try {
            const poll = await Poll.findOne({id: req.params.id});

            if (poll) {
                res.json(poll);
                return;
            } else {
                res.sendStatus(404);
                return;
            }
        } catch (err) {
            res.sendStatus(500);
        }
    },

    create: async (req, res) => {
        const data = req.body;

        // [ {type: 'select', text: 'asdasdasd', options: ['asda']}, {type}]
        const inputs = [];
        
        for (let i = 0; i < data.forms.length; i++) {
            const el = data.forms[i];
            
            if (!el.text) {
                res.status(400).send({ errMsg: 'Text is required!'});
                return;
            }

            if (!el.type) {
                res.status(400).send({ errMsg: 'Type is required!'})
                return;
            }

            if (!['select', 'text'].includes(el.type)) {
                res.status(400).send({ errMsg: 'Type is wrong!'})
                return;
            }

            if (el.type == 'select' && (!el.options || el.options.length == 0)) {
                res.status(400).send({ errMsg: 'Options is required for type "select"!'});
                return;
            }

            const input = new Input({
                text: el.text,
                type: el.type,
                options: el.options
            });

            inputs.push(await input.save());
        }

        const poll = new Poll({
            name: data.name,
            url: 'test',
            forms: inputs,
            // questions
        });

        try {
            poll.save();
            console.log('Poll created!');
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
            return;
        }
    },

    changeStatus: async (req, res) => {
        const { status } = req.body;

        const poll = await Poll.findById(req.params.id);

        if (!['wait', 'active', 'close'].includes(status)) {
            res.status(403).send({errMsg: 'Wrong status'});
            return;
        }

        poll.status = status;
        
        try {
            poll.save();
            res.sendStatus(200);            
        } catch (err) {
            res.sendStatus(500);
            return;
        }
    },

    delete: async (req, res) => {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            res.sendStatus(404);
            return;
        }

        for (let index = 0; index < poll.forms.length; index++) {
            const input = poll.forms[index];

            Input.findByIdAndDelete(input);
        }
        
        try {
            await Poll.findByIdAndDelete(req.params.id);            
            res.sendStatus(200);            
        } catch (err) {
            res.sendStatus(500);
            return;
        }
    }

};