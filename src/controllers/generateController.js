// import openai from "../config/openai.js";
// import Thread from "../models/Thread.js";

// export const generateThread = async (req, res) => {
//   const { type = "thread", topic, numTweets = 1 } = req.body;

//   // 🔒 Validate required field
//   if (!topic || typeof topic !== 'string' || topic.trim() === '') {
//     return res.status(400).json({ 
//       error: "Missing or invalid 'topic'. Must be a non-empty string (e.g., 'Walrus', 'Sui Move')." 
//     });
//   }

//   // Validate type
//   if (!['tweet', 'thread'].includes(type)) {
//     return res.status(400).json({ 
//       error: "Invalid 'type'. Must be 'tweet' or 'thread'." 
//     });
//   }

//   // Validate numTweets for threads
//   if (type === 'thread') {
//     if (typeof numTweets !== 'number' || numTweets < 2 || numTweets > 6) {
//       return res.status(400).json({ 
//         error: "For threads, 'numTweets' must be a number between 2 and 6." 
//       });
//     }
//   }

//   try {
//     const systemPrompt = `You are a world-class Sui ecosystem expert. Generate Twitter content about Sui topics on like Walrus, Seal, Sui Move, zkLogin, etc.

// Rules:
// - If format = "tweet": output ONE tweet (≤ 280 chars)
// - If format = "thread": output a numbered thread (e.g., "1/4: ...") with exactly ${numTweets} parts
// - Use emojis: 🐘 (Walrus), 🔒 (Seal), 💡 (insights)
// - End with 1–2 hashtags: #Sui #Web3 #SuiMove
// - NEVER add explanations — ONLY the tweet(s)`;

//     const userPrompt = `Topic: ${topic.trim()}\nFormat: ${type}\nNumber of tweets: ${numTweets}`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       temperature: 0.7,
//       max_tokens: 500
//     });

//     let tweets = response.choices[0].message.content
//       .split("\n")
//       .map(line => line.trim())
//       .filter(line => line && !line.startsWith("```"));

//     if (tweets.length === 0) {
//       tweets = ["No content generated. Try a clearer topic like 'Sui Move' or 'Walrus'."];
//     }

//     const thread = await Thread.create({ tweets });
//     res.json({ success: true, tweets });
//   } catch (err) {
//     console.error("AI Generation Error:", err);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// };








// controllers/generateController.js
import openai from "../config/openai.js";

export const generateThread = async (req, res) => {
  const { type = "thread", topic, numTweets = 1 } = req.body;

  // 🔒 Validate required field
  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ 
      error: "Missing or invalid 'topic'. Must be a non-empty string (e.g., 'Walrus', 'Sui Move')." 
    });
  }

  // Validate type
  if (!['tweet', 'thread'].includes(type)) {
    return res.status(400).json({ 
      error: "Invalid 'type'. Must be 'tweet' or 'thread'." 
    });
  }

  // Validate numTweets for threads
  if (type === 'thread') {
    if (typeof numTweets !== 'number' || numTweets < 2 || numTweets > 6) {
      return res.status(400).json({ 
        error: "For threads, 'numTweets' must be a number between 2 and 6." 
      });
    }
  }

  try {
    const systemPrompt = `You are a world-class Sui ecosystem expert. Generate Twitter content about Sui topics like Walrus, Seal, Sui Move, zkLogin, etc.

Rules:
- If format = "tweet": output ONE tweet (≤ 280 chars)
- If format = "thread": output a numbered thread (e.g., "1/4: ...") with exactly ${numTweets} parts
- Use emojis: 🐘 (Walrus), 🔒 (Seal), 💡 (insights)
- End with 1–2 hashtags: #Sui #Web3 #SuiMove
- NEVER add explanations — ONLY the tweet(s)`;

    const userPrompt = `Topic: ${topic.trim()}\nFormat: ${type}\nNumber of tweets: ${numTweets}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    let tweets = response.choices[0].message.content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("```") && line.length > 0);

    if (tweets.length === 0) {
      tweets = ["No content generated. Try a clearer topic like 'Sui Move' or 'Walrus'."];
    }

    // ✅ Just send the tweets — no database save
    res.json({ success: true, tweets });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
};




















