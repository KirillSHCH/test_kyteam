import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @ApiProperty({ description: 'Имя' })
  firstName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @ApiProperty({ description: 'Фамилия' })
  secondName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Отчество' })
  middleName?: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: 'Email пользователя' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: 'Пароль пользователя' })
  password: string;
}
