import { configDotenv } from "dotenv";

configDotenv();

const requiredEnvVars = ["MONGODB_URI", "FRONTEND_URL"] as const;

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI as string,
  frontendUrl: process.env.FRONTEND_URL as string,
} as const;