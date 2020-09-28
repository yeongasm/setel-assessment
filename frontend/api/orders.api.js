export function OrdersEvent(app) {

    app.put('/orders', (req, res) => {
        console.log('req => ', req);
    });

}