import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNewsletterSubscriptionDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'LinkedIn URL must not exceed 100 characters' })
  linkedin?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000, { message: 'Message must not exceed 1000 characters' })
  message: string;
}
