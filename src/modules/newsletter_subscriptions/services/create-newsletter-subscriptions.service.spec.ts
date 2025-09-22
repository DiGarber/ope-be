import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { NewsletterSubscriptionsService } from './create-newsletter-subscriptions.service';
import { NewsletterSubscription } from '../entities/newsletter-subscription.entity';
import { CreateNewsletterSubscriptionDto } from '../dto/create-newsletter-subscription.dto';

describe('NewsletterSubscriptionsService', () => {
  let service: NewsletterSubscriptionsService;
  let repository: Repository<NewsletterSubscription>;

  // Mock repository
  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  // Test data
  const mockSubscriptionDto: CreateNewsletterSubscriptionDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    message: 'I would like to subscribe to your newsletter.',
  };

  const mockSubscription: NewsletterSubscription = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    message: 'I would like to subscribe to your newsletter.',
    created_at: new Date('2025-01-01T00:00:00.000Z'),
    updated_at: new Date('2025-01-01T00:00:00.000Z'),
  };

  const mockSubscriptions: NewsletterSubscription[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      message: 'I would like to subscribe to your newsletter.',
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z'),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      linkedin: undefined,
      message: 'Please add me to your mailing list.',
      created_at: new Date('2025-01-02T00:00:00.000Z'),
      updated_at: new Date('2025-01-02T00:00:00.000Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterSubscriptionsService,
        {
          provide: getRepositoryToken(NewsletterSubscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NewsletterSubscriptionsService>(
      NewsletterSubscriptionsService,
    );
    repository = module.get<Repository<NewsletterSubscription>>(
      getRepositoryToken(NewsletterSubscription),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new newsletter subscription', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null); // No existing subscription
      mockRepository.create.mockReturnValue(mockSubscription);
      mockRepository.save.mockResolvedValue(mockSubscription);

      // Act
      const result = await service.create(mockSubscriptionDto);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockSubscriptionDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(mockSubscriptionDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockSubscription);
      expect(result).toEqual(mockSubscription);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockSubscription);

      // Act & Assert
      await expect(service.create(mockSubscriptionDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(mockSubscriptionDto)).rejects.toThrow(
        'Email is already subscribed to the newsletter',
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockSubscriptionDto.email },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle subscription without linkedin field', async () => {
      // Arrange
      const dtoWithoutLinkedin: CreateNewsletterSubscriptionDto = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'Please add me to your mailing list.',
      };

      const subscriptionWithoutLinkedin: NewsletterSubscription = {
        ...mockSubscription,
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        linkedin: undefined,
        message: 'Please add me to your mailing list.',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(subscriptionWithoutLinkedin);
      mockRepository.save.mockResolvedValue(subscriptionWithoutLinkedin);

      // Act
      const result = await service.create(dtoWithoutLinkedin);

      // Assert
      expect(result).toEqual(subscriptionWithoutLinkedin);
      expect(result.linkedin).toBeUndefined();
    });

    it('should handle repository errors during save', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSubscription);
      mockRepository.save.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.create(mockSubscriptionDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all newsletter subscriptions ordered by created_at DESC', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockSubscriptions);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockSubscriptions);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no subscriptions exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors during find', async () => {
      // Arrange
      const dbError = new Error('Database query failed');
      mockRepository.find.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow('Database query failed');
    });
  });

  describe('findByEmail', () => {
    it('should return subscription when email exists', async () => {
      // Arrange
      const email = 'john.doe@example.com';
      mockRepository.findOne.mockResolvedValue(mockSubscription);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockSubscription);
    });

    it('should return null when email does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should handle repository errors during findOne', async () => {
      // Arrange
      const email = 'test@example.com';
      const dbError = new Error('Database query failed');
      mockRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findByEmail(email)).rejects.toThrow(
        'Database query failed',
      );
    });

    it('should handle empty email string', async () => {
      // Arrange
      const email = '';
      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in email', async () => {
      // Arrange
      const specialEmailDto: CreateNewsletterSubscriptionDto = {
        ...mockSubscriptionDto,
        email: 'test+label@example-domain.co.uk',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        ...mockSubscription,
        email: 'test+label@example-domain.co.uk',
      });
      mockRepository.save.mockResolvedValue({
        ...mockSubscription,
        email: 'test+label@example-domain.co.uk',
      });

      // Act
      const result = await service.create(specialEmailDto);

      // Assert
      expect(result.email).toBe('test+label@example-domain.co.uk');
    });

    it('should handle maximum length strings', async () => {
      // Arrange
      const maxLengthDto: CreateNewsletterSubscriptionDto = {
        name: 'A'.repeat(100), // Max length name
        email: 'test@example.com',
        linkedin: 'B'.repeat(100), // Max length linkedin
        message: 'C'.repeat(1000), // Max length message
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        ...mockSubscription,
        ...maxLengthDto,
      });
      mockRepository.save.mockResolvedValue({
        ...mockSubscription,
        ...maxLengthDto,
      });

      // Act
      const result = await service.create(maxLengthDto);

      // Assert
      expect(result.name).toHaveLength(100);
      expect(result.linkedin).toHaveLength(100);
      expect(result.message).toHaveLength(1000);
    });
  });
});
