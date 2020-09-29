import { Controller, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
    constructor(private paymentService : PaymentService) {}

    /**
     * TODO(Afiq):
     * Add request body validation, throw http exception if it is not correct.
    */

    @Post()
    async processPayment(@Req() req)
    {
        return await this.paymentService.processPayment(req.body.id);
    }
}
