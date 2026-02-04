import { Logger } from "@packages/logger";
import express from "express";
import { prisma } from '../config/lib/prisma';
import { corsConfig } from "../cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    if (!process.env.SERVER_PORT) {
      throw new Error("Environment variable `SERVER_PORT` not found");
    }
    this.app.set("port", process.env.SERVER_PORT);

    this.app.use(corsConfig());

    this.app.use(morgan("tiny"));

    this.app.use(cookieParser());
  }

  public routes(): void {
    // Root
    this.app.get("/", (req, res) => {
      res.send("API is running");
    });

    // Get all users
    this.app.get("/users", async (req, res) => {
      try {
        const users = await prisma.user.findMany({
          orderBy: { id: "asc" },
        });

        res.json({
          success: true,
          count: users.length,
          data: users,
        });
      } catch (error) {
        Logger.error("Failed to fetch users:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch users",
        });
      }
    });

    // Health check
    this.app.get("/health", async (req, res) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok", database: "connected" });
      } catch {
        res.status(503).json({ status: "error", database: "disconnected" });
      }
    });
  }


  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      Logger.info(`API is running at http://localhost:${this.app.get("port")}`);
    });
  }
}

// Lightweight database connection check
async function connectDatabase() {
  try {
    await prisma.$connect();
    Logger.info("Database connected successfully!");
  } catch (error) {
    Logger.error("Database connection failed:", error);
    process.exit(1);
  }
}

async function main() {
  await connectDatabase();

  const server = new Server();
  server.start();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  Logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  Logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch(async (error) => {
  Logger.error("Failed to start application:", error);
  await prisma.$disconnect();
  process.exit(1);
});