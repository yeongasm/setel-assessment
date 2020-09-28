import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import db from './mysql/db';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
