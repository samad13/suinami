import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoutes from "./routes/generateRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();



app.use(cors({
  origin: [
    'https://repeasyy.vercel.app',
    'https://repeasy.vercel.app', 
    'http://localhost:5173'
  ],
  credentials: true
}));

app.options("*", cors());

app.set("trust proxy", true);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("OK");
}); 

app.use("/api/generate", generateRoutes);
app.use("/api/analytics", analyticsRoutes);


export default app;
