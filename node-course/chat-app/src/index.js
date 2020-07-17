const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pathToPublicDirectory = path.join(__dirname, '../public');

app.use(express.static(pathToPublicDirectory));

io.on('connection', (socket) => {
    console.log('New websocket connection');

    socket.emit('message', 'Welcome');
    // Sending message to every client except newly connected client
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        // Check for sanity
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback();
    });

    socket.on('disconnect', () =>{
        // Since user has already disconnected, we are not using socket.broadcast.emit
        io.emit('message', 'A user has left');
    });
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});