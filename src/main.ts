import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   const redis = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        
      }
    },
  );

  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL ?? '',
    exposedHeaders: 'set-cookie',
  })

  app.useGlobalPipes(new ValidationPipe());



  const config = new DocumentBuilder()
    .setTitle('Juicify API')
    .setDescription('API documentation for Juicify')
    .setVersion('1.0')
    .addTag('Juicify')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);


  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

