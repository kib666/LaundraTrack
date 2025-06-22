const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Searching for users with missing or null emails using a raw query...');

  // Use a raw query to find documents where the email field is null or does not exist.
  const usersToFix = await prisma.user.findRaw({
    filter: { email: { $in: [null, undefined] } }
  });

  if (!usersToFix || usersToFix.length === 0) {
    console.log('No users with null or missing emails found. Your data is clean!');
    return;
  }

  console.log(`Found ${usersToFix.length} user(s) to fix.`);

  for (const user of usersToFix) {
    const userId = user._id.$oid; // Extract the string ID from the MongoDB ObjectId
    const placeholderEmail = `user_${userId}@placeholder.email`;
    console.log(`Updating user ${userId} (${user.name}) with placeholder email: ${placeholderEmail}`);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { email: placeholderEmail },
      });
      console.log(`Successfully updated user ${userId}.`);
    } catch (updateError) {
      console.error(`Failed to update user ${userId}:`, updateError);
    }
  }

  console.log('Data cleanup process has finished.');
}

main()
  .catch((e) => {
    console.error('An error occurred while running the data-fixing script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 