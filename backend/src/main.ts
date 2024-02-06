import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();



  const config = new DocumentBuilder()
  .setTitle('Talk Board')
  .setDescription('Forum management platform')
  .setVersion('1.0')
  .addTag('user')
  .addTag('forum')
  .addTag('message')
  .addTag('customer')
  .addTag('sendgrid')
  .addBearerAuth(
    { 
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'apiKey', // I`ve attempted type: 'apiKey' too
      in: 'Header'
    },
    'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document);



  await app.listen(3000);
}
bootstrap();
