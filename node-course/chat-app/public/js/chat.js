const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('#txtMessage');
const $messageFormButton = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#btnSendLoc');

socket.on('message', (message) => {
    console.log(message);
});

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', $messageFormInput.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        
        if (error) {
            return console.log(error);
        }
         
        console.log('Message delivered');
    }); 
});

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser');
    }

    $locationBtn.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared');
            $locationBtn.removeAttribute('disabled');
        });
    })
});