import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userService.repo.findOne({ where: { email: user.email } });

    if (existingUser) {
      throw new BadRequestException('Email занят');
    }

    const model = this.userService.repo.create(user);
    return this.userService.repo.save(model);
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userService.repo.findOneOrFail({
      where: { email },
      select: { id: true, password: true, email: true },
    });

    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpException({ error: 'Неправильный пароль' }, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
