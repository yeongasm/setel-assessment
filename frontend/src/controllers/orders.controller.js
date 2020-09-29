import axios from 'axios';

export default {
    
    createNewOrder(onSuccess, onError, onFinally = () => {}) {
        axios.put('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    processOrderPayment(id, onSuccess, onError, onFinally = () => {}) {
        axios.post('/payment/process', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },

    getAllOrders(onSuccess, onError, onFinally = () => {}) {
        axios.get('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    deleteAllOrders(onSuccess, onError, onFinally = () => {}) {
        axios.delete('/orders')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    deleteOrder(id, onSuccess, onError, onFinally = () => {}) {
        axios.delete('/orders/${id}')
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    cancelOrder(id, onSuccess, onError, onFinally = () => {}) {
        axios.post('/orders/cancel', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    },
    
    shipOrder(id, onSuccess, onError, onFinally = () => {}) {
        axios.post('/orders/ship', {
            id: id
        })
        .then(onSuccess)
        .catch(onError)
        .finally(onFinally);
    }

}