require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello Express!!');
})

app.get('/weather', (req, res) => {
    res.send({
        location: 'Edison',
        condition: 'Sunny',
        temprature: 23
    })
})

app.listen(port, () => {
    console.log(`Express app running on port ${port}.`)
})