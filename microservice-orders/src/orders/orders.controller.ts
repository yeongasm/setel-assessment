import { Controller, Put, Get, Delete, Param, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private ordersSerivce: OrdersService) {}

    @Put()
    async addNew() {
        return await this.ordersSerivce.addNew();
    }

    /**
     * TODO(Ygsm):
     * For routes that take in a request, we should probably verify
     * that the request's body meets all of the transaction's criteria.
    */

    @Post('ship')
    async shipOrder(@Req() req) {
        return await this.ordersSerivce.shipOrder(req.body);
    }

    @Post('cancel')
    async cancelOrder(@Req() req) {
        const orderId = req.body.id;
        return await this.ordersSerivce.cancelOrder(orderId);
    }

    @Get()
    async getAll() {
        return await this.ordersSerivce.getAll();
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id) {
        return await this.ordersSerivce.deleteOrder(id);
    }

    @Delete()
    async deleteAll() {
        return await this.ordersSerivce.deleteAll();
    }
}
