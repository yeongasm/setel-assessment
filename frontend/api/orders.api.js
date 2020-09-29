const axios = require('axios');
const express = require('express');

const router = new express.Router();

function forwardTo(route) {
    const key = route.split('/')[1];
    const apiURLs = {
        'orders':  process.env.MICROSERVICE_HOSTNAME + ':' + process.env.ORDERS_PORT,
        'payment': process.env.MICROSERVICE_HOSTNAME + ':' + process.env.PAYMENTS_PORT
    };
    return apiURLs[key] + route;
}

router.put('/orders', (req, res) => {
    axios.put(forwardTo('/orders'))
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(404).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.post('/payment', (req, res) => {
    axios.post(forwardTo('/payment'), req.body)
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(404).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.get('/orders', (req, res) => {
    axios.get(forwardTo('/orders'))
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(500).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.delete('/orders', (req, res) => {
    axios.delete(forwardTo('/orders'))
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(500).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.delete('/orders/:id', (req, res) => {
    axios.delete(forwardTo('/orders/:id'))
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(500).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.post('/orders/cancel', (req, res) => {
    axios.post(forwardTo('/orders/cancel'), req.body)
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(500).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});

router.post('/orders/ship', (req, res) => {
    axios.post(forwardTo('/orders/ship'), req.body)
    .then((result) => {
        const { data } = result;
        res.status(result.status).send(data);
    })
    .catch((error) => {
        if (error && error.code == 'ECONNREFUSED') {
            res.status(500).send('Unable to establish connection to route.')
            return;
        }
        res.status(404).send(error);
    });
});


module.exports = router;