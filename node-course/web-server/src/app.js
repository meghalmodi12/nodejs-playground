require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const port = process.env.PORT || 3000;

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

app.get('/weather', (req, res) => {
    res.send({
        location: 'Edison',
        condition: 'Sunny',
        temprature: 23
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Help',
        message: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        message: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Express app running on port ${port}.`)
})