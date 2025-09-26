/* eslint-disable */
import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { SeedreamImageController } from './image.controller';
import { SeedreamImageService } from './image.service';

@Module({
  controllers: [StoryController, SeedreamImageController],
  providers: [StoryService, SeedreamImageService],
})
export class StoryModule {}
