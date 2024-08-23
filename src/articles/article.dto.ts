import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: 'Заголовок статьи' })
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'Описание статьи' })
  description?: string;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Флаг публикации' })
  published?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'ЧПУ' })
  slug?: string;
}
