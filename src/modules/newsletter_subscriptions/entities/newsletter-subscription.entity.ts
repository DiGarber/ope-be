import { BaseEntity } from '@src/modules/common/base-entity.entity';
import { Entity, Column } from 'typeorm';

@Entity('newsletter_subscriptions')
export class NewsletterSubscription extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  linkedin?: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  message: string;
}
