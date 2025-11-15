import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();


const allowedOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : ['https://repeasyy.vercel.app']; 

app.use(cors({
  origin: (origin, callback) => {
    
    if (!origin) return callback(null, true);
    
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    

    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
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
