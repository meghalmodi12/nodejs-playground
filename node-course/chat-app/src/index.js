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

io.on('connection', () => {
    console.log('New websocket connection');
})

server.listen(port, () => {
    console.log(`Express app is running on port ${port}.`);
});