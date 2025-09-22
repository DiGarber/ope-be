import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterSubscriptionsController } from './controllers/newsletter-subscriptions.controller';
import { NewsletterSubscriptionsService } from './services/create-newsletter-subscriptions.service';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterSubscription])],
  controllers: [NewsletterSubscriptionsController],
  providers: [NewsletterSubscriptionsService],
  exports: [NewsletterSubscriptionsService],
})
export class NewsletterSubscriptionsModule {}
