const request = require('postman-request');

const weatherStackBaseURL = 'http://api.weatherstack.com/current';
const weatherStackAccessToken = '323ceb5e752d274d3fc34b2a8dc31470';
const weatherStackURL = `${weatherStackBaseURL}?access_key=${weatherStackAccessToken}&query=New York`;

const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/New%20York.json';
const mapBoxAccessToken = 'pk.eyJ1IjoibWVnaGFsbW9kaTEyIiwiYSI6ImNrYWhxa2ppZDBpc2EzMG8wcnFnYmppMWgifQ.UOC7Z-OlEwzsuUztfJNUOQ';
const mapBoxURL = `${mapBoxBaseURL}?access_token=${mapBoxAccessToken}&limit=1`;

request({ url: weatherStackURL, json: true }, (error, response) => {
    console.log(response.body);
});

request({ url: mapBoxURL, json: true }, (error, response) => {
    if (error) {
        console.log('Unable to connect geo location service');
    } else if (response.body.features.length === 0) {
        console.log('Please check search text');
    } else {
        const [lat, long] = response.body.features[0].center;
        console.log([lat, long]);
    }
});