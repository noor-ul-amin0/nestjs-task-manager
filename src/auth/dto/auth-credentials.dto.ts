import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the account', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthCredentialsDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the account' })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email to send password reset instructions to',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'The new password for the account' })
  @IsString()
  password: string;
}
