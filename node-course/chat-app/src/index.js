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

let count = 0;

/*
    server (emit) - client (receive) - countUpdated
    client (emit) - server (receive) - increment
*/
io.on('connection', (socket) => {
    console.log('New websocket connection');

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        io.emit('countUpdated', count);
    });
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});