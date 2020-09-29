<template>
  <div class="main">
    <div class="title-container flex-row flex-left flex-middle">
      <span class="title">Setel Assessment Landing Page</span>
    </div>
    <div class="sub-title-container">
      <div class="sub-title">Application process</div>
      <ol class="descriptor-container">
        <li>To create a new order, simply click on the <code>New Order</code> button.</li>
        <li>Application will process recently created order for payment after timeout time specified in the input below elapses.</li>
        <li>To clear database and order list, click on <code>Clear Orders</code>.</li>
        <li>To cancel a specific order, click on an order to select and click on <code>Cancel Order</code>.</li>
        <li>Note that once an order has been delivered, you will not be able to cancel it.</li>
      </ol>
    </div>
    <div class="btn-container flex-row flex-right flex-middle">
      <span class="timeout-input-container flex-row flex-right flex-middle">
          <span class="timeout-description flex-row flex-right flex-middle">Time until app triggers payment and delivery for orders (in seconds)</span>
          <input type="number" class="timeout-input" v-model="paymentTriggerTimeout"/>
      </span>
      <span class="btn" @click="createNewOrder">New Order</span>
      <span class="btn" @click="cancelOrder">Cancel Order</span>
      <span class="btn" @click="deleteAllOrders">Clear Orders</span>
    </div>
    <div class="table-container">
      <table>
        <thead class="table-header">
          <tr class="table-row head">
            <th class="col col-0">Id</th>
            <th class="col col-1">Date</th>
            <th class="col col-2">Time</th>
            <th class="col col-3">Status</th>
          </tr>
        </thead>
        <tbody class="flex-col">
          <tr v-for="(orders, index) in listOfOrders" :key="index" :class="'table-row data'">
            <td v-for="(col, key) in orders" :key="key" :class="rowCss(index, key)" @click="selectedOrder = index">{{ col }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import moment from 'moment';
import orderController from './../controllers/orders.controller';
import { onMounted, ref, computed } from 'vue';

export default {
  setup() {

    let selectedOrder = ref(0);
    let paymentTriggerTimeout = ref(10);
    const listOfOrders = ref([]);

    const stateToStringMap = {
      0: "Cancelled",
      1: "Created",
      2: "Confirmed",
      3: "Delivered"
    };

    onMounted(() => {
      getAllOrders();
    });

    /**
     * Getting all the orders in the database.
    */
    const getAllOrders = () => {
      const onSuccess = (result) => {
        const ordersEntryFromDB = result.data.result;

        for (let i = 0; i < ordersEntryFromDB.length; i++) {
          const row = ordersEntryFromDB[i];
          listOfOrders.value.push([
            row.order_id,
            moment.utc(row.order_date).local().format('DD/MM/YYYY'), 
            moment.utc(row.order_time).local().format('HH:mm:ss'), 
            stateToStringMap[row.order_state]
          ]);

          switch (row.order_state) {
            case 1:
              setTimeout(() => { processOrderPayment(row.order_id); }, paymentTriggerTimeout.value * 1000);
              break;
            case 2:
              setTimeout(() => { deliverOrderOut(row.order_id); }, paymentTriggerTimeout.value * 1000);
              break;
            default:
              break;
          }
        }
      };

      const onError = (error) => { console.log('getAllOrders onError error => ', error); };

      orderController.getAllOrders(onSuccess, onError);
    };

    /**
     * Ship order.
    */
   const deliverOrderOut = (orderId) => {
     const onSuccess = (result) => {
        const shippedOrder = result.data.result[0];

        for (let i = 0; i < listOfOrders.value.length; i++) {
          const row = listOfOrders.value[i];

          if (row[0] != shippedOrder.order_id)
            continue;

          row[3] = stateToStringMap[shippedOrder.order_state];
          break;
        }
     };

     const onError = (error) => { console.log('deliverOrderOut onError error => ', error); }

     orderController.shipOrder(orderId, onSuccess, onError);
   };

    /**
     * Process order's payment.
    */
    const processOrderPayment = (orderId) => {
      // Just update the list of orders on success.
      // Running out of time, so not going with the more performance approach.
      // Ideal situation should retrieve order id and update only for that id.
      const onSuccess = (result) => {
        const id = result.data.id;
        const orderState = result.data.state;
        
        for (const row of listOfOrders.value) {
          if (row[0] != id)
            continue;

          row[3] = stateToStringMap[orderState];
          break;
        }

        if (orderState == 2) {
          setTimeout(() => { deliverOrderOut(id) }, paymentTriggerTimeout.value * 1000);
        }
      };

      const onError = (error) => { console.log('processOrderPayment onError error => ', error); };

      orderController.processOrderPayment(orderId, onSuccess, onError);
    };

    /**
     * Creating a new order.
    */
    const createNewOrder = () => {
      if (!paymentTriggerTimeout.value)
        paymentTriggerTimeout.value = 10;

      const onSuccess = (result) => {
        const orderId = result.data.order_id;
        listOfOrders.value = [];
        getAllOrders();
        //setTimeout(() => { processOrderPayment(orderId); }, paymentTriggerTimeout.value * 1000);
      };

      const onError = (error) => { console.log('createNewOrder onError error => ', error); };

      orderController.createNewOrder(onSuccess, onError);
    };

    const deleteAllOrders = () => {
      const onSuccess = (result) => {
        //console.log('deleteAllOrders onSuccess result => ', result);
      };

      const onError = (error) => { console.log('deleteAllOrders onError error => ', error); };

      orderController.deleteAllOrders(onSuccess, onError);
      listOfOrders.value = [];
    };

    /**
     * Cancelling a specific order. 
    */
    const cancelOrder = () => {
      if (!listOfOrders.value.length)
        return;

      const toBeCancelledOrder = listOfOrders.value[selectedOrder.value];
      const cancelId = toBeCancelledOrder[0];

      const onSuccess = (result) => {
        selectedOrder.value = 0;
        for (const row of listOfOrders.value) {
          if (row[0] != cancelId)
            continue;
          
          row[3] = stateToStringMap[0];
          break;
        }
      };

      const onError = (error) => { console.error('cancelOrder onError error => ', error); };

      if (toBeCancelledOrder[3] != 'Created')
        return;

      orderController.cancelOrder(cancelId, onSuccess, onError);
    };

    /**
     * Returns the style for the row 
    */
   const rowCss = (index, key) => {
     return (selectedOrder.value == index) ? `col col-${key} selected` : `col col-${key}` ;
   };

    return {
      selectedOrder,
      paymentTriggerTimeout,
      listOfOrders,
      createNewOrder,
      deleteAllOrders,
      cancelOrder,
      rowCss
    }
  }
}
</script>