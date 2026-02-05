import { PrismaClient } from '../generated/prisma/client';
import { Logger } from '@packages/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  } as any); // Type assertion to bypass the accelerateUrl requirement

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test connection
prisma.$connect()
  .then(() => {
    Logger.info("Prisma connected to MongoDB successfully");
  })
  .catch((err: Error) => {
    Logger.error("Prisma connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  Logger.info("Prisma disconnected");
});