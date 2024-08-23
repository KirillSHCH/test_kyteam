import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../shared/page-options.dto';

export class QueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Заголовок статьи' })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({ description: 'Описание статьи' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ description: 'Флаг публикации' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  readonly published?: boolean;

  @ApiPropertyOptional({ description: 'Дата публикации' })
  @IsString()
  @IsOptional()
  readonly publishedAt?: string;

  @ApiPropertyOptional({ description: 'ФИО автора' })
  @IsString()
  @IsOptional()
  readonly authorName?: string;

  @ApiPropertyOptional({ description: 'ID автора' })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly authorId?: number;
}
