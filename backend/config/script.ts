import { Logger } from '@packages/logger';
import { prisma } from './libs/prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  });
  Logger.info('Created user:', user);

  const allUsers = await prisma.user.findMany({

  });
  Logger.info('All users:', JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });