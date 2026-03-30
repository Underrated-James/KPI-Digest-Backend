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
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const formatError = (error: any): string[] => {
        const messages: string[] = [];
        if (error.constraints) {
          messages.push(...Object.values(error.constraints).map((msg: any) => 
            msg.replace('should not exist', 'is not exist')
          ));
        }
        if (error.children && error.children.length > 0) {
          error.children.forEach((child: any) => {
            messages.push(...formatError(child));
          });
        }
        return messages;
      };

      const messages = errors.flatMap(formatError);
      return new BadRequestException(messages);
    }
  }));

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  
   console.log(`Application is running on: ${await app.getUrl()}`);
}


bootstrap();