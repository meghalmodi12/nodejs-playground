const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pathToPublicDirectory = path.join(__dirname, '../public');

app.use(express.static(pathToPublicDirectory));

/**
 * SOCKET.IO - Summary
 * socket.emit - send message to a specific client address
 * io.emit - send message to all the clients
 * socket.broadcast.emit - send message to all the client, except the current
 * io.to(room).emit - send message to all the clients connected to the room
 * socket.broadcast.to.emit - send message to all the client connected to the room, except the current
 * socket.join - Join specific chat room
*/
io.on('connection', (socket) => {
    console.log('New websocket connection');

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room});
        if (error) {
            callback(error);
        }

        // Join room
        socket.join(user.room);
        socket.emit('message', generateMessage('admin', 'Welcome'));
        socket.broadcast.to(user.room).emit('message', generateMessage('admin', `${user.username} has joined`));
        callback();
    }); 

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback('User not found');
        } else {
            const filter = new Filter();

            // Check for sanity
            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed!')
            }

            io.to(user.room).emit('message', generateMessage(user.username, message));
            callback();
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback('User not found');
        } else {
            io.emit('locationMessage', generateLocationMessage(user.username, coords));
            callback();
        } 
    });

    socket.on('disconnect', () =>{
        const user = removeUser(socket.id);
        if (user) {
            // Since user has already disconnected, we are not using socket.broadcast.emit
            io.to(user.room).emit('message', generateMessage('admin', `${user.username} has left`));
        }
    });
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});