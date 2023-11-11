const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
    is_online: { type: String, default: "0" }
},
    { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;