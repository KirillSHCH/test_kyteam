import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Направление сортировки',
    enum: [SortOrder.ASC, SortOrder.DESC],
    default: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  readonly order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({ description: '№ Страницы', minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Кол-во items на странице',
    minimum: 1,
    maximum: 50,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
