import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();


const allowedOriginsString = process.env.FRONTEND_URLS;

let allowedOrigins;
if (allowedOriginsString) {
  allowedOrigins = allowedOriginsString.split(',').map(url => url.trim()).filter(url => url !== '');
} else {
  // Fallback if FRONTEND_URLS is not set, e.g., for development
  allowedOrigins = ['http://localhost:5173']; 
  console.warn("FRONTEND_URLS environment variable not set. Defaulting to ['http://localhost:5173'].");
}

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
  optionsSuccessStatus: 204 
}));

// const frontendUrl = process.env.FRONTEND_URL || 'https://repeasyy.vercel.app';

// app.use(cors({
//   origin: frontendUrl
// }));


app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("OK");
}); 

app.use("/api/generate", generateRoutes);


export default app;
