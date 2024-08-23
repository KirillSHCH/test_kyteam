import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { ArticleEntity } from './article.entity';
import { QueryDto } from './query.dto';
import { TestImports } from '../../test/test-imports';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let userService: UsersService;
  let user: UserEntity;
  let article: ArticleEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: TestImports,
      controllers: [],
      providers: [{ provide: CACHE_MANAGER, useValue: mockCacheManager }],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    userService = module.get<UsersService>(UsersService);

    const userEntity = userService.repo.create({
      email: 'test@test.com',
      password: 'test',
      firstName: 'Test',
      secondName: 'Test',
    });
    user = await userService.repo.save(userEntity);

    const articleEntity = service.repo.create({
      title: 'Test',
      description: 'Test description',
      authorId: user.id,
    });
    article = await service.repo.save(articleEntity);
  });

  afterAll(async () => {
    await userService.repo.delete(user.id);
    await service.repo.delete(article.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('получение всех статей', async () => {
    const queryParams = new QueryDto();
    const data = await service.findAll(queryParams);
    const meta = data.meta;
    const queryData = data.data;
    expect(meta.page).toBe(1);
    expect(meta.take).toBe(10);
    expect(meta.itemCount).toBe(queryData.length);
  });

  it('получение стати по id', async () => {
    const foundedArticle = await service.findOneById(article.id);
    expect(foundedArticle.title).toBe(article.title);
    expect(foundedArticle.description).toBe(article.description);
    expect(foundedArticle.authorId).toBe(article.authorId);
    expect(foundedArticle.authorId).toBe(user.id);
  });

  it('создание статьи', async () => {
    const article = await service.create({
      title: 'Test',
      description: 'Test description',
      authorId: user.id,
    });
    const foundedArticle = await service.repo.findOne({
      where: { id: article.id },
    });

    expect(foundedArticle.title).toBe(article.title);
    expect(foundedArticle.description).toBe(article.description);
    expect(foundedArticle.authorId).toBe(article.authorId);
    expect(foundedArticle.authorId).toBe(user.id);
  });

  it('удаление статьи', async () => {
    const article = await service.create({
      title: 'Test title',
      description: 'Test description',
      authorId: user.id,
    });
    await service.delete(article.id);

    const foundedArticle = await service.repo.findOne({
      where: { id: article.id },
    });

    expect(foundedArticle).toBeNull();
  });
});
