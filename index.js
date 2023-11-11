const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const userRoute = require('./routers/userRoute');
const User = require('./models/userModel')



const app = express();
app.use('/', userRoute);

const server = http.Server(app)
    .listen(8080, () => {
        mongoose.connect('mongodb+srv://priyanshuSharma:priyanshuSh@cluster0.ugwexpg.mongodb.net/?retryWrites=true&w=majority')
            .then(() => {
                console.log("Mongodb connected....");
            })
    })


const io = require('socket.io')(server);
const userNamespace = io.of('/user-namespace')
userNamespace.on('connection', async (socket) => {
    console.log("A User Connected");
    console.log(socket.handshake.auth.token);


    await User.findByIdAndUpdate({ _id: socket.handshake.auth.token }, { $set: { is_online: '1' } });
    socket.broadcast.emit('getOnlineUser', { user_id: socket.handshake.auth.token });

    socket.on('chat-delivery', (data) => {
        console.log("Here");
        console.log(data.msg);
        socket.broadcast.emit('chatUpdate', data.msg);
    })

    socket.on('disconnect', async () => {
        console.log("A user Disconnected");
        await User.findByIdAndUpdate({ _id: socket.handshake.auth.token }, { $set: { is_online: '0' } });
        socket.broadcast.emit('getOfflineUser', { user_id: socket.handshake.auth.token });
    })


})