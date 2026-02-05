import { Logger } from "@packages/logger";
import express from "express";
import mongoose from 'mongoose';
import { corsConfig } from "../config/cors";
import morgan from "morgan";
import { config } from "../config/env";
// import cookieParser from "cookie-parser";

const app = express();
app.use(
  corsConfig()
);

app.use(morgan("dev"));

mongoose
  .connect(config.mongodbUri)
  .then(() => {
    Logger.info(`DB connected Successfully`);
  })
  .catch((err) => {
    console.log("Failed to connect to DB", err);
  });

app.use(express.json());

app.get("/", async (req, res, next) => {
  res.send("Hello world");
  res.status(200).json({
    message: "Welcome to TaskHub API"
  });
  next();
});

// error middleware
app.use((req, res, next) => {
  res.status(500).json({
    message: "Internal server error"
  });
  next();
});

// not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found"
  });
});

app.listen(config.port, () => {
  Logger.info(`Server running on http://localhost:${config.port}`);
});