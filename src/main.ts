import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).map(msg => 
            msg.replace('should not exist', 'is not exist')
          );
        }
        return [];
      }).flat();
      
      return new BadRequestException({
        message: messages,
        error: 'Bad Request',
        statusCode: 400
      });
    }
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
