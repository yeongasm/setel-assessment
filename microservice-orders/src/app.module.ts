import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import db from './mysql/db';

@Module({
    imports: [
        ConfigModule.forRoot(),
        OrdersModule
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
