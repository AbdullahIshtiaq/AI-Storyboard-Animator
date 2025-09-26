/* eslint-disable */

import { Body, Controller, Post } from '@nestjs/common';
import { SeedreamImageService } from './image.service';
import { ImageResponseDto } from './dto/image-response.dto';

@Controller('image')
export class SeedreamImageController {
  constructor(private readonly seedreamService: SeedreamImageService) {}

  @Post()
  async generate(@Body() prompt: string): Promise<ImageResponseDto> {
    return this.seedreamService.generateImagesFromScenes(prompt);
  }
}
