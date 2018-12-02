const Poll = require('../models/Poll');
const { uploadToCloud, deleteFromCloud } = require('../lib/asw');

const inputTypes = ['select', 'text'];
const statusTypes = ['wait', 'active', 'close'];

class Input {
    constructor(data) {
        this.text = data.text;
        this.type = data.type;

        if (this.type === 'select') {
            this.options = data.options;
        }
    }
}

function isValidInput(input) {
    const hasText = !!input.text;
    const hasType = !!input.type;

    if (!hasText || !hasType) return false;

    const typeOk = inputTypes.includes(input.type);

    if (!typeOk) return false;

    const hasOptions = input.options && input.options != 0;

    if (input.type == 'select' && !hasOptions) return false;
    
    return true;
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
            const input = data.forms[i];

            if (!isValidInput(input)) {
                res.sendStatus(400);
                return;
            }

            inputs.push(new Input(input));
        }

        if (!req.files['a'] || !req.files['b']) {
            res.sendStatus(400);
            return;
        }

        const url_a = uploadToCloud(req.files['a']);
        const url_b = uploadToCloud(req.files['b']);

        if (!url_a || !url_b) {
            res.sendStatus(500);
            return;
        }
        
        const poll = new Poll({
            name: data.name,
            forms: inputs,
            variant: {
                a: url_a,
                b: url_b
            }
        });

        try {
            poll.save();
            console.log('Poll created!');
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
    },

    edit: async (req, res) => {
        const data = req.body;
        const { id } = req.params;

        const inputs = [];
        
        for (let i = 0; i < data.forms.length; i++) {
            const input = data.forms[i];

            if (!isValidInput(input)) {
                res.send(400);
                return;
            }

            inputs.push(new Input(input));
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

        if (!statusTypes.includes(status)) {
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

        deleteFromCloud(poll.variant.a);
        deleteFromCloud(poll.variant.b);

        console.log('Poll deleted!');
        res.sendStatus(200);
    }

};