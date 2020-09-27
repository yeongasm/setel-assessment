import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //console.log('Server listening on PORT: ', process.env.SERVER_PORT);
  console.log('Server listening on PORT: ', 80);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(80);
  //await app.listen(process.env.SERVER_PORT);
}
bootstrap();
