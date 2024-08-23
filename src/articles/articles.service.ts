import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { QueryDto } from './query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PageDto } from '../shared/page.dto';
import { PageMetaDto } from '../shared/page-meta.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity) readonly repo: Repository<ArticleEntity>,
    @Inject(EventEmitter2) readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findAll(queryDto: QueryDto): Promise<PageDto<ArticleEntity>> {
    const queryBuilder = this.repo.createQueryBuilder(ArticleEntity.sqlAlias);

    queryBuilder
      .orderBy(`${ArticleEntity.sqlAlias}.createdAt`, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take);

    this.applyFilters(queryBuilder, queryDto);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: queryDto });

    return new PageDto(entities, pageMeta);
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<ArticleEntity>, filter: QueryDto) {
    if (filter.title) this.filterByTitle(queryBuilder, filter.title);
    if (filter.description) this.filterByDescription(queryBuilder, filter.description);
    if (filter.published) this.filterByPublishedStatus(queryBuilder, filter.published);
    if (filter.publishedAt) this.filterByPublishedAt(queryBuilder, filter.publishedAt);
    if (filter.authorName || filter.authorId)
      this.filterByAuthor(queryBuilder, filter.authorName, filter.authorId);
  }

  private filterByTitle(queryBuilder: SelectQueryBuilder<ArticleEntity>, title: string) {
    queryBuilder.andWhere(`${ArticleEntity.sqlAlias}.title ILIKE :title`, {
      title: `%${title}%`,
    });
  }

  private filterByDescription(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    description: string,
  ) {
    queryBuilder.andWhere(`${ArticleEntity.sqlAlias}.description ILIKE :description`, {
      description: `%${description}%`,
    });
  }

  private filterByPublishedStatus(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    published: boolean,
  ) {
    queryBuilder.andWhere({ published });
  }

  private filterByPublishedAt(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    publishedAt: string,
  ) {
    const { startDate, endDate } = this.getPublishedAtDates(publishedAt);
    queryBuilder.andWhere({ publishedAt: Between(startDate, endDate) });
  }

  private filterByAuthor(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    authorName?: string,
    authorId?: number,
  ) {
    if (authorId) {
      queryBuilder.andWhere({ authorId });
    }

    if (authorName) {
      queryBuilder
        .leftJoin(
          UserEntity,
          UserEntity.sqlAlias,
          `${ArticleEntity.sqlAlias}.authorId = ${UserEntity.sqlAlias}.id`,
        )
        .andWhere(
          `CONCAT(${UserEntity.sqlAlias}.firstName` +
            ', ' +
            `${UserEntity.sqlAlias}.secondName` +
            ', ' +
            `${UserEntity.sqlAlias}.middleName)` +
            ' ILIKE :name',
          { name: `%${authorName}%` },
        );
    }
  }

  private getPublishedAtDates(publishedAt: string): {
    startDate: Date;
    endDate: Date;
  } {
    const date = new Date(publishedAt);
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 0));

    return { startDate, endDate };
  }

  public async findOneById(id: number): Promise<ArticleEntity | null> {
    const cachedData = await this.cacheService.get(id.toString());

    if (cachedData) {
      return cachedData as ArticleEntity;
    }

    const article = await this.repo.findOneBy({ id });

    this.eventEmitter.emit('articles.set-cache', id, article);

    return article;
  }

  public create(article: CreateArticleDto & { authorId?: number }): Promise<ArticleEntity> {
    const model = this.repo.create(article);

    return this.repo.save(model);
  }

  public async update(id: number, article: UpdateArticleDto): Promise<ArticleEntity> {
    const model = await this.repo.save({ id, ...article }, { reload: true });
    this.eventEmitter.emit('articles.update-cache', id, model);

    return model;
  }

  public async delete(id: number): Promise<DeleteResult> {
    this.eventEmitter.emit('articles.delete-cache', id);

    return this.repo.delete(id);
  }
}
