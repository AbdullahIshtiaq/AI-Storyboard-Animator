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
            console.log("Seedream API response data:", data);

            // If data is an array of frames, extract URLs
            const frames = data?.data?.map((item: { url: string }) => item.url) || "N/A";

            console.log("Extracted frame URLs:", frames);
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

        console.log("Generating images from scenes with data:", data);


        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const story: string = parsedData?.prompts?.story || "";
        const scenes: string[] = parsedData?.prompts?.scenes || [];

        const readyPrompt = this.createPrompt(story, scenes);

        const img = await this.generateImage(readyPrompt);

        // const img = {
        //     "url": [
        //         "https://ark-content-generation-v2-ap-southeast-1.tos-ap-southeast-1.volces.com/seedream-4-0/021758814863971e641ee46b93e8beaf1fb3bde23bbe0c6d621ba_0.jpeg?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTYWJkZTExNjA1ZDUyNDc3YzhjNTM5OGIyNjBhNDcyOTQ%2F20250925%2Fap-southeast-1%2Ftos%2Frequest&X-Tos-Date=20250925T154142Z&X-Tos-Expires=86400&X-Tos-Signature=d58899d6b1daaacdab74bc44ffe36590b1d75f80fe5b6e346f77153e9954fcbc&X-Tos-SignedHeaders=host",
        //         "https://ark-content-generation-v2-ap-southeast-1.tos-ap-southeast-1.volces.com/seedream-4-0/021758814863971e641ee46b93e8beaf1fb3bde23bbe0c6d621ba_1.jpeg?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTYWJkZTExNjA1ZDUyNDc3YzhjNTM5OGIyNjBhNDcyOTQ%2F20250925%2Fap-southeast-1%2Ftos%2Frequest&X-Tos-Date=20250925T154142Z&X-Tos-Expires=86400&X-Tos-Signature=e87b2e2e01129958432a4077bda37b15d67d47edfcd3fb944b08fd38ada51c62&X-Tos-SignedHeaders=host",
        //         "https://ark-content-generation-v2-ap-southeast-1.tos-ap-southeast-1.volces.com/seedream-4-0/021758814863971e641ee46b93e8beaf1fb3bde23bbe0c6d621ba_2.jpeg?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTYWJkZTExNjA1ZDUyNDc3YzhjNTM5OGIyNjBhNDcyOTQ%2F20250925%2Fap-southeast-1%2Ftos%2Frequest&X-Tos-Date=20250925T154143Z&X-Tos-Expires=86400&X-Tos-Signature=1214b02e6409a6ebd60a4acdfa67b90c6c7aaf733e1161079b2aebb5b96cae83&X-Tos-SignedHeaders=host"
        //     ]
        // };

        // const imagRes = img.url.join(", ");
        // return imagRes ? { url: imagRes } : { url: "N/A" };

        return img;

    }

    createPrompt(story: string, scenes: string[]): string {

        console.log("Creating prompt with story:", story);
        console.log("Creating prompt with Scenes:", scenes);


         let prompt = "Story: " + `${story}.  Scenes:  ${scenes.join(" | ")}. Now, generate one or more visually striking images that bring the above story and scenes to life.`;
        console.log("Generated prompt for image generation:", prompt);

        return prompt;
    }

   
}
