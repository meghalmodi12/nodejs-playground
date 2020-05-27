require('dotenv').config();
const request = require('postman-request');

const getGeoCode = (location, callback) => {
    const baseURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`;
    const requestURL = `${baseURL}?access_token=${process.env.MAPBOX_TOKEN}&limit=1`;

    request({ url: requestURL, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect geo location service');
        } else if (body.features.length === 0) {
            callback('Please check search text');
        } else {
            const objInfo = {
                placeName: body.features[0].place_name,
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0]
            }
            callback(undefined, objInfo)
        }
    })
}

module.exports = getGeoCode