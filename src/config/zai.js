import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const zai = new OpenAI({
  
    apiKey: process.env.ZAI_API_KEY, 
    
    baseURL: "https://api.z.ai/api/paas/v4/", 
});

export default zai;