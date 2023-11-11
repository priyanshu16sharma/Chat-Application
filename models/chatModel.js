const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true }
},
    { timestamps: true }
);

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;