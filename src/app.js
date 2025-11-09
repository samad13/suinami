import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: frontendUrl
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("OK");
}); 

app.use("/api/generate", generateRoutes);


export default app;
