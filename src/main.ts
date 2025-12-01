import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Blood Fit')
    .setDescription('The blood-fit API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        name: 'authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const apiDoc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, apiDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT!);
}
bootstrap()
  .then(() => {
    console.log(`server running on: ${process.env.API_URL}/api`);
    console.log(`server documentation: ${process.env.API_DOCUMENTATION}`);
  })
  .catch((err) => {
    console.log(err);
  });
