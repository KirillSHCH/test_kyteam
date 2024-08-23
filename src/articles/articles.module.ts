import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { ArticlesListener } from './articles.listener';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  exports: [ArticlesService],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesListener],
})
export class ArticlesModule {}
