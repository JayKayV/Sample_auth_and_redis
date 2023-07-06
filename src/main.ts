import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
  .setTitle('userAPI')
  .setDescription('API for user')
  .addBearerAuth(
    {
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header'
    }
  )
  .setVersion('1.0')
  .addTag('user')
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('myapi', app, document);

  app.useGlobalPipes(new ValidationPipe({whitelist: true}));

  /*app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      'host': 'localhost', 'port': 6379
    }
  })

  await app.startAllMicroservices();*/

  await app.listen(3000);
}
bootstrap();
