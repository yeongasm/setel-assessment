import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import db from './mysql/db';

@Module({
    imports: [
        ConfigModule.forRoot(),
        OrdersModule,
        PaymentModule
    ]
})
export class AppModule {
    
    onModuleInit() {
        db.connect(); 
    };

    onModuleDestroy() {
        db.end();
    }
}
