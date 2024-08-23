import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { TestImports } from '../../test/test-imports';
import { EntityNotFoundError } from 'typeorm';

describe('ArticlesService', () => {
  let service: AuthService;
  let userService: UsersService;
  let user: UserEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: TestImports,
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);

    const userEntity = userService.repo.create({
      email: 'test1@test.com',
      password: 'test',
      firstName: 'Test',
      secondName: 'Test',
    });
    user = await userService.repo.save(userEntity);
  });

  afterAll(async () => {
    await userService.repo.delete(user.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('успешная регистрация', async () => {
    const newUser = await service.register({
      email: 'user@test.com',
      password: 'user',
      firstName: 'New',
      secondName: 'User',
    });
    const registeredUser = await userService.repo.findOne({ where: { id: newUser.id } });
    expect(registeredUser.email).toEqual(newUser.email);
    expect(registeredUser.firstName).toEqual(newUser.firstName);
    expect(registeredUser.secondName).toEqual(newUser.secondName);

    await userService.repo.delete(newUser.id);
  });

  it('ошибочная регистрация уже занятого email', async () => {
    const newUser = {
      email: 'test1@test.com',
      password: 'test',
      firstName: 'Test',
      secondName: 'Test',
    };
    await expect(service.register(newUser)).rejects.toThrow(BadRequestException);
    await expect(service.register(newUser)).rejects.toThrow('Email занят');
  });

  it('успещная авторизация', async () => {
    const { accessToken } = await service.login('test1@test.com', 'test');
    expect(accessToken).not.toBeNull();
  });

  it('ошибочная авторизация несуществующих данных', async () => {
    const email: string = 'undefined@undefined.undefined';
    const password: string = 'password123';

    await expect(service.login(email, password)).rejects.toThrow(EntityNotFoundError);
  });
});
