import db from './../mysql/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {

    async processPayment(id: string) {
        return new Promise(async (resolve, reject) => {
 
            const condition = `order_id='${id}'`;
            let result = await db.selectRowFrom('orders', condition);
            
            if (!result.status) {
                reject(result);
                return;
            }
            
            const row = result.result[0];
            
            if (!row.order_state) {
                resolve({ status: 1, id: row.order_id, state: row.order_state, msg: 'Cancelled' });
                return;
            }
            
            const randomBetween = (a, b) : number => {
                return Math.floor(Math.random() * (b - a + 1) + a);
            }
            
            // 0 - Payment declined.
            // 1 - Payment confirmed.
            const paymentStatus = randomBetween(0, 1);

            if (!paymentStatus) {

                result = await db.updateRowFrom('orders', ['order_state'], [0], condition);
                if (!result.status) {
                    reject(result);
                    return;
                }
                
                resolve({ status: 1, id: row.order_id, state: 0, msg: 'Cancelled due to failed payment' });
                return;
            }
            
            result = await db.updateRowFrom('orders', ['order_state'], [2], condition);
            if (!result.status) {
                reject(result);
                return;
            }
            
            resolve({ status: 1, id: row.order_id, state: 2, msg: 'Payment succeeded' });
        });
    }

}
