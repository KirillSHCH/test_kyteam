import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email пользователя' }) @IsEmail() email: string;
  @ApiProperty({ description: 'Пароль пользователя' }) @IsString() password: string;
}
