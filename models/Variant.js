const mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema;

const schema = new Schema({
    type: {
        type: String, // html, music, video, image
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const variant = mongoose.model('Variant', schema);
module.exports = variant;
