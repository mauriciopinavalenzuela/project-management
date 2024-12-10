import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filters';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuración de validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza errores si hay propiedades no permitidas
      transform: true, // Convierte automáticamente los tipos en DTOs
    }),
  );

  // Filtro global para excepciones
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Configuración de CORS
  app.enableCors({
    origin: '*', // Cambia esto si necesitas restringirlo a dominios específicos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Project Management API')
    .setDescription('API para gestión de proyectos y usuarios')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Puerto dinámico desde las variables de entorno
  const port = process.env.PUERTO_NESTJS || 3000; // Asegúrate de usar PUERTO_NESTJS del .env
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
