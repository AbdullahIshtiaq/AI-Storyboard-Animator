/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { StoryResponseDto } from './dto/story-response.dto';
import OpenAI from 'openai';

@Injectable()
export class StoryService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  async generateStory(prompt: string): Promise<{ story: string; scenes: string[] }> {
    // 1️⃣ Generate story using GPT
    const gptResponse = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative story generator. Create engaging short stories with vivid visual scenes.
          
          Return your response as JSON in this exact format:
          {
            "story": "The complete story text with rich descriptions",
            "scenes": ["Scene 1 description", "Scene 2 description", "Scene 3 description"],
            "summary": "Brief 1-2 sentence story summary",
            "genre": "Story genre (e.g., fantasy, adventure, mystery, etc.)"
          }
          
          Make the scenes visually descriptive - describe what someone would see if they were watching this story unfold.`
        },
        {
          role: "user",
          content: `Create a short creative story based on this prompt: "${prompt}". Include 3-4 key visual scenes that represent different parts of the story.`
        },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    let raw = gptResponse.choices[0].message?.content || "";

    raw = raw.trim()
      .replace(/,\s*]/g, "]")  
      .replace(/,\s*}/g, "}");


    // Parse the JSON response
    let parsedResponse: StoryResponseDto;

    let story = "No story generated.";
    let scenes: string[] = [];

    try {
      parsedResponse = JSON.parse(raw);
      story = parsedResponse?.story;
      scenes = parsedResponse?.scenes || [];
    } catch (error) {
      console.error("Error parsing GPT response:", error);
    }

    console.log("Generated Story:", story);
    console.log("Generated Scenes:", scenes);

    return {story, scenes};
  }
}

