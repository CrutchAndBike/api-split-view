const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Let us know you by adding your name!']
    },
    gender: String,
    age: Number,
    avatar: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
