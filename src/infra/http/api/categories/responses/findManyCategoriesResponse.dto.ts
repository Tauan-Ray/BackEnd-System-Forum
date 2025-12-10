import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './CategoryResponse.dto';

class MetaResponseDto {
  @ApiProperty({ example: 3 })
  _results: number;

  @ApiProperty({ example: 3 })
  _total_results: number;

  @ApiProperty({ example: 1 })
  _page: number;

  @ApiProperty({ example: 1 })
  _total_page: number;
}

export class FindManyCategoriesResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  _data: CategoryResponseDto[];

  @ApiProperty({ type: MetaResponseDto })
  _meta: MetaResponseDto;
}
