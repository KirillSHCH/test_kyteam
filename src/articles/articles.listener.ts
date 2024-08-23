import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticlesListener {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @OnEvent('articles.set-cache')
  async setCache(id: number, data: ArticleEntity) {
    await this.cacheService.set(id.toString(), data);
  }

  @OnEvent('articles.update-cache')
  async updateCache(id: number, data: ArticleEntity) {
    const cachedDataById = await this.cacheService.get(id.toString());

    if (cachedDataById) {
      await this.cacheService.set(id.toString(), data);
    }
  }

  @OnEvent('articles.delete-cache')
  async deleteCache(id: number) {
    const cachedData = await this.cacheService.get(id.toString());

    if (cachedData) {
      await this.cacheService.del(id.toString());
    }
  }
}
