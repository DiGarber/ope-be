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
        const dbUrl = configService.get('DB_URL');
        console.log(
          'DB_URL:',
          dbUrl ? dbUrl.replace(/:[^:@]*@/, ':***@') : 'undefined',
        );

        // Validate that DB_URL is provided and is a string
        if (!dbUrl || typeof dbUrl !== 'string') {
          throw new Error(
            'DB_URL environment variable must be provided as a string',
          );
        }

        return {
          type: 'postgres',
          url: dbUrl,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: JSON.parse(
            configService.get('ORM_SYNCHRONIZE') ?? 'false',
          ),
          ssl: {
            rejectUnauthorized: false,
          },
          // Additional options to handle authentication issues
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
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
