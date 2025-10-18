import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoUri =
  'mongodb+srv://iankurbyplacencia30:Vw0y66M6AlUmjaFI@expressdb.ccixe.mongodb.net/laudratrack?retryWrites=true&w=majority&appName=expressdb';

async function addMultipleAdmins() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Define User schema inline (matching the main app schema)
    const userSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: false },
        role: {
          type: String,
          enum: ['customer', 'staff', 'admin', 'superadmin'],
          default: 'customer',
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected', 'active'],
          default: 'pending',
        },
        isActive: { type: Boolean, default: true },
      },
      { timestamps: true }
    );

    // Add pre-save hook for password hashing
    userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) return next();
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Array of admins to create
    const adminsToCreate = [
      {
        email: 'kurby@gmail.com',
        password: 'rootroot',
        firstName: 'Kurby',
        lastName: 'Placencia',
      },
      {
        email: 'geovanny@gmail.com',
        password: 'rootroot',
        firstName: 'Geovanny',
        lastName: 'Admin',
      },
      {
        email: 'kent@gmail.com',
        password: 'rootroot',
        firstName: 'Kent',
        lastName: 'Admin',
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const adminData of adminsToCreate) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`⏭️  Skipped: ${adminData.email} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create new admin
      const newAdmin = new User({
        ...adminData,
        role: 'admin',
        status: 'active',
        isActive: true,
      });

      await newAdmin.save();
      console.log(`✅ Created: ${adminData.email}`);
      createdCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${createdCount}`);
    console.log(`   Skipped: ${skippedCount}`);

    await mongoose.disconnect();
    console.log('\n✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMultipleAdmins();
