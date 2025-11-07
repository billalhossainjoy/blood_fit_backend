import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('InRagZ')
    .setDescription('The InRagZ API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const apiDoc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, apiDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

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
