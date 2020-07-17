const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const message = document.querySelector('#txtMessage').value;
    socket.emit('sendMessage', message); 
});

document.querySelector('#btnSendLoc').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    })
});