import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNewsletterSubscriptionDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

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
