const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const message = document.querySelector('#txtMessage').value;
    socket.emit('sendMessage', message); 
})