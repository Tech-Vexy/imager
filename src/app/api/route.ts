import { NextRequest, NextResponse } from "next/server";

const NUM_IMAGES = 4;
const DEFAULT_GUIDANCE_SCALE = 7.5;
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

async function generateImage(prompt: string, guidanceScale: number, apiKey: string): Promise<string> {
    const uniqueSeed = Math.floor(Math.random() * 1000000);
    const modelPayload = {
        inputs: prompt,
        parameters: {
            seed: uniqueSeed,
            guidance_scale: guidanceScale,
        },
    };

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(modelPayload),
    });

    if (!response.ok) {
        throw new Error(`Hugging Face API Error: ${await response.text()}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    return `data:${blob.type};base64,${base64Image}`;
}

export async function POST(req: NextRequest) {
    try {
        const { prompt, guidance_scale } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
        }

        const apiKey = process.env.HF_APIKEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key is missing" }, { status: 500 });
        }

        const guidanceScale = guidance_scale || DEFAULT_GUIDANCE_SCALE;

        const imagePromises = Array(NUM_IMAGES).fill(null).map(() =>
            generateImage(prompt, guidanceScale, apiKey)
        );

        const generatedImages = await Promise.all(imagePromises);

        return NextResponse.json({ images: generatedImages });
    } catch (error) {
        console.error("Error during image generation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
