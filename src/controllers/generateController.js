import openai from "../config/openai.js";
import ai from "../config/gemini.js";
import { getRandomPersona } from "../config/sui_personas.js";
import { getRandomAspect } from "../config/sui_aspects.js";
import { getRandomTemperature } from "../config/ai_temprature.js";

export const generateThread = async (req, res) => {
  const { name, tweetType, maxGeneration, twitterHandle } = req.body;

  // 🔒 Validate required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: "Missing or invalid 'name'." });
  }

  if (!tweetType || !['short', 'long'].includes(tweetType)) {
    return res.status(400).json({ error: "'tweetType' must be 'short' or 'long'." });
  }

  const maxGenNum = parseInt(maxGeneration, 10);
  if (isNaN(maxGenNum) || (maxGenNum !== 1 && maxGenNum !== 2)) {
    return res.status(400).json({ error: "'maxGeneration' must be 1 or 2." });
  }

  if (!twitterHandle || typeof twitterHandle !== 'string' || !twitterHandle.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'twitterHandle' (e.g., '@sui')." });
  }

 const persona = getRandomPersona();
 const temp = getRandomTemperature();
const aspect = getRandomAspect();
 console.log("Selected Persona:", persona.id);
 console.log("Selected Temperature:", temp);
 console.log("Selected Aspect:", aspect.id);

 const personaPrompt = persona.prompt(name);

  //Set generation parameters
  const numTweets = maxGenNum;
  const isShort = tweetType === "short";
  const charLimit = isShort
    ? "Each tweet must be under 280 characters."
    : "Each tweet must be at least > 560 characters long .";

  
    

 const systemPrompt = `${personaPrompt}
 

**Project Info:**
- Name: "${name}"
- Twitter Handle: ${twitterHandle}

**Rules — NON-NEGOTIABLE:**
1. **ALWAYS mention the project using its Twitter or X handle** (${twitterHandle}) in **every single tweet**.
   - Example: "Check out ${twitterHandle}'s new Walrus integration!"
   - Never refer to the project by name alone — **always use @handle**.
2.Type: ${tweetType === "short" ? "Short tweet(s)" : "Long tweet(s)"}.
3. Generate exactly ${numTweets} tweet${numTweets > 1 ? "s" : ""}. ${charLimit}
4. Use **Sui-specific emojis**
5. End with **1–2 relevant hashtags**: but this #${name} should always be part of it  #Sui #Web3 #SuiMove #WalrusStorage (choose based on topic)
6. **NEVER** add explanations, disclaimers, or markdown — output **ONLY the tweet(s)**
7. Keep tone **casual, hype, and community-focused** — like a real builder on Crypto Twitter
8. Focus on the **"${aspect.id}"** aspect of the project: ${aspect.description}
9. dont make mistake calling what is not storage as storage. if its not a storage project dont call it storage.

**Failure to include ${twitterHandle} in every tweet is unacceptable.**`;

const userPrompt = `Generate content for this project name: "${name}".
Determine what kind of Sui project it is (DeFi, AI, MPC, Wallet, Infrastructure, Staking, Analytics, Community, Exchnages, Token, NFT, Storage etc...),
then write tweet(s) accordingly.
Project: ${name}
Twitter: ${twitterHandle}
Parts: ${numTweets}`;

try {
   const useGemini = Math.random() < 0.5; // 50% chance
    let tweets = [];
     if (useGemini) {
      
       console.log("🤖 Using Gemini model");
      
     const result = await ai.models.generateContent({
         model: "gemini-2.5-flash",
       contents: [
        
           { role: "user", parts: [{ text: userPrompt }] } 
      ],
    config: {
            temperature: temp,
               
                systemInstruction: systemPrompt 
        }
    });
const text = result.text;
      tweets = text
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t && !t.startsWith("```"));
    } else {
      console.log("🧠 Using OpenAI model");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
       
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature:temp,
      // max_tokens: 500
     
    });

    tweets = response.choices[0].message.content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("```") && line.length > 0);
  }
    if (tweets.length === 0) {
      tweets = ["No content generated. Try a clearer topic."];
    }

    res.json({ success: true, tweets });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
};
