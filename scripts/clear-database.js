const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup...');

  // The order of deletion is important to avoid relation constraint issues.
  // Start with models that have relations to other models.
  
  console.log('Deleting LaundryJob records...');
  await prisma.laundryJob.deleteMany({});
  
  console.log('Deleting Order records...');
  await prisma.order.deleteMany({});
  
  console.log('Deleting Appointment records...');
  await prisma.appointment.deleteMany({});
  
  // Finally, delete the User records after all dependent records are gone.
  console.log('Deleting User records...');
  await prisma.user.deleteMany({});

  console.log('Database has been successfully cleared.');
}

main()
  .catch((e) => {
    console.error('An error occurred during database cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 