const socket = io();

// Elements
const $sidebar = document.querySelector('#sidebar');
const $messages = document.querySelector('#messages');
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('#txtMessage');
const $messageFormButton = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // Last message element
    const $lastMessage = $messages.lastElementChild;
    const lastMessageStyles = getComputedStyle($lastMessage);
    const lastMessageMargin = parseInt(lastMessageStyles.marginBottom);
    const lastMessageHeight = $lastMessage.offsetHeight + lastMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far we have scrolled already
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - lastMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
});

socket.on('message', (message) => {
    console.log(message);

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') 
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
}); 

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage);

    const html = Mustache.render(locationMessageTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a') 
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
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