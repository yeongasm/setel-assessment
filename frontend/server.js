if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const compression = require('compression');
const proxy = require('express-http-proxy');
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const axios = require('axios');

const app = express();

app.use(serveStatic(__dirname + '/dist'));
app.use(compression());

app.put('/orders', (req, res) => {
    console.log('hola!!');
    axios.put('http://localhost:3000/orders')
        .then((result) => {
            const data = result.data;
            res.send(data);
        })
        .catch((error) => {
            console.log('error => ', error);
        });
});

app.listen(process.env.SERVER_PORT, () => {
    console.log('Server running at port:', process.env.SERVER_PORT);
});