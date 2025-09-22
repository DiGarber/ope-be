import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscription } from '../entities/newsletter-subscription.entity';
import { CreateNewsletterSubscriptionDto } from '../dto/create-newsletter-subscription.dto';

@Injectable()
export class NewsletterSubscriptionsService {
  constructor(
    @InjectRepository(NewsletterSubscription)
    private readonly newsletterSubscriptionRepository: Repository<NewsletterSubscription>,
  ) {}

  async create(
    createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existingSubscription =
      await this.newsletterSubscriptionRepository.findOne({
        where: { email: createNewsletterSubscriptionDto.email },
      });

    if (existingSubscription) {
      throw new ConflictException(
        'Email is already subscribed to the newsletter',
      );
    }

    // Create new subscription
    const subscription = this.newsletterSubscriptionRepository.create(
      createNewsletterSubscriptionDto,
    );

    return await this.newsletterSubscriptionRepository.save(subscription);
  }

  async findAll(): Promise<NewsletterSubscription[]> {
    return await this.newsletterSubscriptionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmail(email: string): Promise<NewsletterSubscription | null> {
    return await this.newsletterSubscriptionRepository.findOne({
      where: { email },
    });
  }
}
