import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { QueryDto } from './query.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { PageDto } from '../shared/page.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все статьи',
  })
  @ApiOkResponse({
    description: 'Приходит массив статей с пагинацией',
  })
  list(@Query() filterDto: QueryDto): Promise<PageDto<ArticleEntity>> {
    return this.articlesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить статью по ID',
  })
  @ApiOkResponse({
    description: 'Приходит статья с запрашиваемым ID',
  })
  show(@Param('id') id: string) {
    return this.articlesService.findOneById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать статью',
  })
  @ApiCreatedResponse({
    description: 'Приходит созданная статья',
  })
  create(@Body() article: CreateArticleDto, @Request() req: any): Promise<ArticleEntity> {
    return this.articlesService.create({ ...article, authorId: req.user.id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить статью',
  })
  @ApiOkResponse({
    description: 'Приходит обновленная статья',
  })
  update(@Param('id') id: string, @Body() article: UpdateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.update(Number(id), article);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить статью',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается результат удаления',
  })
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.articlesService.delete(Number(id));
  }
}
