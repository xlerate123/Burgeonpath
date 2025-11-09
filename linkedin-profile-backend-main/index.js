import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";
import dotenv from "dotenv";
import mainRouter from "./routes.js";

dotenv.config();

const app = express();

app.use(cors({
  // Allow local dev servers and deployed frontend origins. Add any other
  // production frontend domains here as needed.
  origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://burgeonpath-phi.vercel.app"
  ],
  credentials: true, // <-- must be true to allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use("/api/v1", mainRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT:${process.env.PORT}`)
})
