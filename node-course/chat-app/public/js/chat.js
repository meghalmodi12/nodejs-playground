const socket = io();

// Elements
const $messages = document.querySelector('#messages');
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('#txtMessage');
const $messageFormButton = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.emit('join', { username, room });

socket.on('message', (message) => {
    console.log(message);

    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') 
    });
    $messages.insertAdjacentHTML('beforeend', html);
}); 

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage);

    const html = Mustache.render(locationMessageTemplate, {
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a') 
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