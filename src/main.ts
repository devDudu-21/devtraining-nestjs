import { NestFactory } from '@nestjs/core';
import * as chalk from 'chalk';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000, () => {
    console.log(
      chalk.bgGreen.black.bold('🚀 Server is running at http://localhost:3000'),
    );
  });
}
bootstrap();
