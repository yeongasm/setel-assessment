import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Payment Microservice listening on PORT: ', process.env.SERVER_PORT);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
