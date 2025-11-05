import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";
import dotenv from "dotenv";
import mainRouter from "./routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:8080", // your frontend dev server
  credentials: true, // allow cookies
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use("/api/v1", mainRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT:${process.env.PORT}`)
})