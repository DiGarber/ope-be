import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsletterSubscriptionsModule } from './modules/newsletter_subscriptions/newsletter-subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(
          configService.get('ORM_SSL'),
          configService.get('DB_HOST'),
          configService.get('DB_PORT'),
          configService.get('DB_USERNAME'),
          configService.get('DB_PASSWORD'),
          configService.get('DB_NAME'),
        );
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: JSON.parse(
            configService.get('ORM_SYNCHRONIZE') ?? 'false',
          ),
          // ssl: JSON.parse(configService.get('ORM_SSL') ?? 'false'),
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
      inject: [ConfigService],
    }),
    NewsletterSubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
