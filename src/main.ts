import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Журнал')
    .setDescription('Описание API методов')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();

  const configService = app.get(ConfigService);
  const config = configService.get('app');
  await app.listen(config.port, () =>
    console.log(
      `Server started on port \x1b[36m${config.port}\x1b[0m\nMode is \x1b[33m${config.environment}\x1b[0m`,
    ),
  );
}
bootstrap();
