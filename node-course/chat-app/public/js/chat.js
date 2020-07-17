const socket = io();

// Elements
const $messages = document.querySelector('#divMessages');
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('#txtMessage');
const $messageFormButton = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#btnSendLoc');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);

    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML('beforeend', html);
}); 

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage);

    const html = Mustache.render(locationMessageTemplate, {
        locationMessage
    });
    $messages.insertAdjacentHTML('beforeend', html);
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