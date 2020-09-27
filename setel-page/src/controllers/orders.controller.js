import axios from 'axios';

const http = axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL
});

export default {
    
    createNewOrder(onSuccess, onError, onFinally = () => {}) {
        http.put('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    processOrderPayment(id, onSuccess, onError, onFinally = () => {}) {
        http.post('/payment/process', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },

    getAllOrders(onSuccess, onError, onFinally = () => {}) {
        http.get('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    deleteAllOrders(onSuccess, onError, onFinally = () => {}) {
        http.delete('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    deleteOrder(id, onSuccess, onError, onFinally = () => {}) {
        http.delete('/orders/${id}')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    cancelOrder(id, onSuccess, onError, onFinally = () => {}) {
        http.post('/orders/cancel', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    shipOrder(id, onSuccess, onError, onFinally = () => {}) {
        http.post('/orders/ship', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    }

}