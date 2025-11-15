import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKeys = process.env.OPENAI_API_KEYS ? process.env.OPENAI_API_KEYS.split(',') : [];

if (apiKeys.length === 0) {
    console.warn("No OpenAI API keys found in OPENAI_API_KEYS environment variable. OpenAI requests will likely fail.");
}


export const getOpenAIClient = () => {
    if (apiKeys.length === 0) {
        throw new Error("Cannot create OpenAI client: No API keys configured.");
    }

    // --- Random Key Selection ---
    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    const selectedKey = apiKeys[randomIndex].trim();
    console.log(`Using OpenAI API Key (randomly selected): ${randomIndex + 1}/${apiKeys.length}`);


    return new OpenAI({
        apiKey: selectedKey,
    });
};

