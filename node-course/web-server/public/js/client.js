const weatherForm = document.querySelector('form');
const addressField = document.querySelector('#txtAddress');
const msgOne = document.querySelector('#msgOne');
const msgTwo = document.querySelector('#msgTwo');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(`/weather?address=${encodeURIComponent(addressField.value)}`)
    .then(response => response.json())
    .then(data => {
        msgOne.textContent = 'Loading...';
        msgTwo.textContent = '';

        if (data.error) {
            msgOne.textContent = data.error;
        } else {
            msgOne.textContent = data.location;
            msgTwo.textContent = data.forecastData;
        }
    });
});