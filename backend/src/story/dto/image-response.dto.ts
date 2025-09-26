/* eslint-disable */

import  {ApiProperty}  from '@nestjs/swagger';

export class ImageResponseDto {
  @ApiProperty({
    description: 'Generated image URL',
    example: 'https://example.com/generated-image.png',
  })
  url: string;
}
