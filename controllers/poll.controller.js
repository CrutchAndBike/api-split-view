const Poll = require('../models/Poll');

class Input {
    constructor(data) {
        this.text = data.text;
        this.type = data.type;

        if (this.type === 'select') {
            this.options = data.options;
        }
    }
}

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

            const input = new Input(el);

            inputs.push(input);
        }

        const poll = new Poll({
            name: data.name,
            url: 'test',
            forms: inputs
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

    edit: async (req, res) => {
        const data = req.body;
        const { id } = req.params;

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

            const input = new Input(el);

            inputs.push(input);
        }

        const poll = await Poll.findOneAndUpdate({_id: id}, {
            $set: {
                name: data.name,
                forms: inputs
            }
        });

        if (!poll) {
            res.sendStatus(400);      
            return;
        }

        console.log('Poll edited!');
        res.sendStatus(200);
    },

    changeStatus: async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;

        if (!['wait', 'active', 'close'].includes(status)) {
            res.status(403).send({errMsg: 'Wrong status'});
            return;
        }

        const poll = await Poll.findOneAndUpdate({_id: id}, {
            $set: {
                status: status
            }
        });

        if (!poll) {
            res.sendStatus(400);            
            return;
        }

        console.log('Poll status changed!');
        res.sendStatus(200);
    },

    delete: async (req, res) => {
        const { id } = req.params;

        const poll = await Poll.findByIdAndDelete(id);

        if (!poll) {
            res.sendStatus(404);
            return;
        }

        console.log('Poll deleted!');
        res.sendStatus(200);
    }

};