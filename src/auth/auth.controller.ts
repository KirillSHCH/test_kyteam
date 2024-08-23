import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import { LoginDto } from './login.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Регистрация',
  })
  @ApiCreatedResponse({
    description: 'Приходят данные о пользователе',
  })
  @ApiBody({ type: CreateUserDto })
  register(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.service.register(user);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Авторизация',
  })
  @ApiOkResponse({
    description: 'Приходит JWT токен',
  })
  @ApiBody({ type: LoginDto })
  login(@Body() input: LoginDto): Promise<{ accessToken: string }> {
    return this.service.login(input.email, input.password);
  }
}
