/* eslint-disable prettier/prettier */

export class StoryResponseDto {
  story: string;       // full generated story
  scenes: string[];    // array of scene descriptions
  summary: string;     // short story summary
  genre: string;       // story genre
}