if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const ordersAPI = require('./api/orders.api');
const bodyParser = require('body-parser');

const app = express();

app.use(serveStatic(__dirname + '/dist'));
app.use(compression());
app.use(bodyParser.json());
app.use(ordersAPI);

app.listen(process.env.SERVER_PORT, () => {
    console.log('Server running at port:', process.env.SERVER_PORT);
});