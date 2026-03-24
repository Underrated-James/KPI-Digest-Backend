import { Reflector, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.flatMap((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).map(msg => 
            msg.replace('should not exist', 'is not exist')
          );
        }
        return [];
      }).flat();

      return new BadRequestException(messages);
    }
  }));

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
  
   console.log(`Application is running on: ${await app.getUrl()}`);
}


bootstrap();