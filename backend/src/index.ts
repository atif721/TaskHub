import { Logger } from "@packages/logger";
import express, { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import { corsConfig } from "../config/cors";
import morgan from "morgan";
import { config } from "../config/env";

import routes from '../routes/index';

const app = express();

// Middlewares
app.use(corsConfig());
app.use(morgan("dev"));
app.use(express.json());

// DB connection
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    Logger.info("DB connected Successfully");
  })
  .catch((err: any) => {
    Logger.error("Failed to connect to DB", err);
  });

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TaskHub API"
  });
});

// API routes
app.use("/api-v1", routes);

// Error-handling middleware
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      message: "Internal server error"
    });
  }
);

// 404 Not Found middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found"
  });
});

// Start server
app.listen(config.port, () => {
  Logger.info(`Server running on http://localhost:${config.port}`);
});