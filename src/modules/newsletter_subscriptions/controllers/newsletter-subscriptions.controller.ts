import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsletterSubscriptionsService } from '../services/create-newsletter-subscriptions.service';
import { CreateNewsletterSubscriptionDto } from '../dto/create-newsletter-subscription.dto';
import { NewsletterSubscription } from '../entities/newsletter-subscription.entity';

@Controller('newsletter-subscriptions')
export class NewsletterSubscriptionsController {
  constructor(
    private readonly newsletterSubscriptionsService: NewsletterSubscriptionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<{
    message: string;
    data: NewsletterSubscription;
  }> {
    const subscription = await this.newsletterSubscriptionsService.create(
      createNewsletterSubscriptionDto,
    );

    return {
      message: 'Newsletter subscription created successfully',
      data: subscription,
    };
  }
}
