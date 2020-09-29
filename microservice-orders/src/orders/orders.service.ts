import db from '../mysql/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {

    addNew() : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const generateId = () => {
                let id = '';
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (let i = 0; i < 32; i++)
                    id += chars.charAt(Math.floor(Math.random() * chars.length));
                return id;
            }
            const orderId = generateId();
            const result = await db.insertInto('orders', ['order_id', 'order_state', 'order_time', 'order_date'], [`'${orderId}'`, 1, 'UTC_TIME()', 'UTC_DATE()']);

            if (!result.status) {
                reject(result);
                return;
            }

            resolve({ status: 1, order_id: orderId });
        });
    }
    
    shipOrder(requestBody) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const condition = `order_id='${requestBody.id}';`;
            let result = await db.updateRowFrom('orders', ['order_state'], [3], condition);

            if (!result.status) {
                reject(result);
                return;
            }

            result = await db.selectRowFrom('orders', condition);

            if (!result.status) {
                reject(result);
                return;
            }

            delete result.result[0].id;

            resolve(result);
        });
    }

    cancelOrder(id: string) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const condition = `order_id='${id}';`;
            const result = await db.updateRowFrom('orders', ['order_state'], [0], condition);

            if (!result.status) {
                reject(result);
                return;
            }

            resolve(result);
        });
    }

    getAll() : Promise<any> {
        return new Promise(async (resolve, reject) => {
            let result = await db.selectColFrom([], 'orders');
            
            if (!result.status) {
                reject(result);
                return;
            }

            // NOTE(Ygsm):
            // Don't really want to share the entry's private key.
            for (const obj of result.result)
                delete obj.id;

            resolve(result);
        });
    }

    deleteOrder(id: string) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const result = await db.deleteRowFrom('orders', 'order_id', `'${id}'`);

            if (!result.status) {
                reject(result);
                return;
            }

            resolve(result);
        });
    }

    deleteAll() : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const result = await db.deleteAllFrom('orders');

            if (!result.status) {
                reject(result);
                return;
            }

            resolve(result);
        });
    }
}
