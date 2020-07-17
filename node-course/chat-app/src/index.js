const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

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

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () =>{
        // Since user has already disconnected, we are not using socket.broadcast.emit
        io.emit('message', 'A user has left');
    });
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});