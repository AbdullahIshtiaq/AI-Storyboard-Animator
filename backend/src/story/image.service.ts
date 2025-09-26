/* eslint-disable */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ImageResponseDto } from './dto/image-response.dto';

@Injectable()
export class SeedreamImageService {
    private apiKey: string | undefined;
    private endpoint = "https://ark.ap-southeast.bytepluses.com/api/v3/images/generations";
    private logger = new Logger(SeedreamImageService.name);

    constructor() {
        this.apiKey = process.env.SEEDREAM_API_KEY;
        if (!this.apiKey) {
            throw new Error("SEEDREAM_API_KEY not set");
        }
    }

    async generateImage(prompt: string): Promise<ImageResponseDto> {
        try {
            const response = await axios.post(
                this.endpoint,
                {
                    "model": "seedream-4-0-250828",
                    "prompt": prompt,
                    "size": "1K",
                    "response_format": "url",
                    "sequential_image_generation": "auto",
                    "sequential_image_generation_options": {
                        "max_images": 3
                    },
                    "watermark": false,
                    "stream": false,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            // If data is an array of frames, extract URLs
            const frames = data?.data?.map((item: { url: string }) => item.url) || "N/A";

            return {
                url: frames.join(", ") // Join URLs into a single string
            };
        } catch (error) {
            this.logger.error(`Seedream generation error": ${error}`);
            return {
                url: "N/A",
            };
        }
    }

    async generateImagesFromScenes(data: string): Promise<ImageResponseDto> {

        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const story: string = parsedData?.prompts?.story || "";
        const scenes: string[] = parsedData?.prompts?.scenes || [];

        const readyPrompt = this.createPrompt(story, scenes);

        const img = await this.generateImage(readyPrompt);

        return img;

    }

    createPrompt(story: string, scenes: string[]): string {
        let prompt = "Story: " + `${story}.  Scenes:  ${scenes.join(" | ")}. Now, generate one or more visually striking images that bring the above story and scenes to life.`;
        console.log("Generated prompt for image generation:", prompt);

        return prompt;
    }

   
}
