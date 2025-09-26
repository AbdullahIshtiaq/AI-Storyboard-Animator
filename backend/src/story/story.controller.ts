/* eslint-disable */

import { Body, Controller, Post } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    const { prompt } = createStoryDto;
    return await this.storyService.generateStory(prompt);
  }
}
