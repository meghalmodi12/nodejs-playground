require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        pageTitle: 'Home'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About',
        imgPath: '/img/profile.png'
    });
});

app.get('/weather', (req, res) => {
    res.send({
        location: 'Edison',
        condition: 'Sunny',
        temprature: 23
    });
});

app.listen(port, () => {
    console.log(`Express app running on port ${port}.`)
})