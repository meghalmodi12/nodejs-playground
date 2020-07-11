const socket = io();

socket.on('countUpdated', (count) => {
    console.log(`The count has been updated to ${count}`);
});

document.querySelector('#btnIncrement').addEventListener('click', () => {
    socket.emit('increment');
});