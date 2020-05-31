const getGeoCode = require('./utils/geocode');
const getForecast = require('./utils/forecast');

const location = process.argv[2];

if (!location) {
    console.log('Please provide a location');
} else {
    getGeoCode(location, (error, { latitude, longitude, placeName: location }) => {
        if (error) {
            return console.log(error);
        } 

        getForecast(latitude, longitude, (forecastError, forecastData) => {
            if (error) {
                return console.log(forecastError);
            } 
            console.log(location);
            console.log(forecastData);
        });
    });
}