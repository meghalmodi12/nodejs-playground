require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const getGeoCode = require('./utils/geocode');
const getForecast = require('./utils/forecast');
const app = express();
const port = process.env.PORT || process.env.LOCAL_PORT;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set up static sirectory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Meghal Modi'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        imgPath: '/img/profile.png',
        name: 'Meghal Modi'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Meghal Modi'
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Help',
        message: 'Help article not found'
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
       return res.send({ error: 'Please provide a location' });
    } 

    getGeoCode(address, (error, { latitude, longitude, placeName: location } = {}) => {
        if (error) {
            return res.send({error});
        } 

        getForecast(latitude, longitude, (forecastError, forecastData) => {
            if (error) {
                return res.send({ error: forecastError});
            } 

            return res.send({
                address,
                location,
                forecastData
            });
        });
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        message: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Express app running on port ${port}.`)
})