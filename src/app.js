import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/generate", generateRoutes);


export default app;
