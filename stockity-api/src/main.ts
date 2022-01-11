import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Stockity API')
    .setDescription(
      'Welcome to Stockity API! Here, you can see the available endpoints to work with!'
    )
    .setVersion('1.0')
    .addTag('items', 'Anything related to product items go here!')
    .addTag('groups', 'Anything related to product groups go here!')
    .build();

  const customOptions: SwaggerCustomOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Stockity API'
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, customOptions);

  await app.listen(8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
