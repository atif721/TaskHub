import { prisma } from './lib/prisma';
import { Logger } from "@packages/logger";

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    Logger.info("Database connected successfully!");

    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
      },
    });
    Logger.log('Created user:', user);

    // Fetch all users
    const allUsers = await prisma.user.findMany();
    Logger.log('All users:', JSON.stringify(allUsers, null, 2));

  } catch (error) {
    Logger.error("Database connection failed:", error);
    throw error;
  }
}

// Seed function for initial data
async function seed() {
  try {
    Logger.info("Starting database seed...");

    // Add your seed data here
    const users = await prisma.user.createMany({
      data: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
      ],
      skipDuplicates: true,
    });

    Logger.info(`Seeded ${users.count} users`);
  } catch (error) {
    Logger.error("Seeding failed:", error);
    throw error;
  }
}

// Main function
async function main() {
  // await testDatabaseConnection();
  // Uncomment to run seed:
  await seed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    Logger.info("Script completed successfully");
  })
  .catch(async (error) => {
    Logger.error("Script failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });