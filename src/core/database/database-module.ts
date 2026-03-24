import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // This is the "Magic" part similar to Spring's properties
        connectionFactory: (connection) => {
          if (configService.get<string>('NODE_ENV') !== 'production') {
            mongoose.set('debug', true);
          }
          return connection;
        },
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}