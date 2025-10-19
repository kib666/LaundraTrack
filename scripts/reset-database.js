#!/usr/bin/env node
/**
 * Database Reset Script - Deletes all orders, appointments, and non-admin users
 * Keeps: Admin and Superadmin users only
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function resetDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    const db = mongoose.connection.db;

    // Delete all orders
    console.log('🗑️  Deleting all orders...');
    const ordersResult = await db.collection('orders').deleteMany({});
    console.log(`   ✅ Deleted ${ordersResult.deletedCount} orders\n`);

    // Delete all appointments
    console.log('🗑️  Deleting all appointments...');
    const appointmentsResult = await db.collection('appointments').deleteMany({});
    console.log(`   ✅ Deleted ${appointmentsResult.deletedCount} appointments\n`);

    // Delete all non-admin users
    console.log('🗑️  Deleting all staff and customer users...');
    const usersResult = await db.collection('users').deleteMany({
      role: { $in: ['staff', 'customer'] },
    });
    console.log(`   ✅ Deleted ${usersResult.deletedCount} users\n`);

    // Show remaining admin users
    console.log('📋 Remaining users (Admin/Superadmin only):');
    const adminUsers = await db
      .collection('users')
      .find({ role: { $in: ['admin', 'superadmin'] } })
      .toArray();

    if (adminUsers.length === 0) {
      console.log('   ⚠️  No admin users found!');
    } else {
      adminUsers.forEach((user) => {
        console.log(
          `   • ${user.firstName} ${user.lastName} (${user.email}) - ${user.role.toUpperCase()}`
        );
      });
    }

    console.log('\n✅ Database reset completed successfully!');
    console.log('🎉 Ready to start fresh!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    process.exit(1);
  }
}

resetDatabase();
