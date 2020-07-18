const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

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

    socket.on('join', ({ username, room }) => {
        // Join room
        socket.join(room);

        socket.emit('message', generateMessage('Welcome'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`));
    }); 

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        // Check for sanity
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(coords));
        callback();
    });

    socket.on('disconnect', () =>{
        // Since user has already disconnected, we are not using socket.broadcast.emit
        io.emit('message', generateMessage('A user has left'));
    });
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});