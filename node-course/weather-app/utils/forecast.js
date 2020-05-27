require('dotenv').config();
const request = require('postman-request');

const getForecast = (latitude, longitude, callback) => {
    const baseURL = 'http://api.weatherstack.com/current';
    const requestURL = `${baseURL}?access_key=${process.env.WEATHERSTACK_TOKEN}&query=${latitude},${longitude}`;

    request({ url: requestURL, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect forecast service');
        } else if (body.error) {
            callback(body.error.info);
        } else {
            const message = `It is ${body.current.weather_descriptions[0]} outside. The current temprature is ${body.current.temperature} and feels like ${body.current.feelslike}.`;
            callback(undefined, message);
        }
    })
};

module.exports = getForecast;