import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoUri =
  'mongodb+srv://iankurbyplacencia30:Vw0y66M6AlUmjaFI@expressdb.ccixe.mongodb.net/laudratrack?retryWrites=true&w=majority&appName=expressdb';

async function createSuperAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Define User schema inline
    const userSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
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

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ email: 'superadmin@laundry.com' });
    if (existingSuperAdmin) {
      console.log('✅ Super Admin already exists!');
      console.log('📧 Email: superadmin@laundry.com');
      console.log('🔑 Password: SuperAdmin@123');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create superadmin user
    const superAdmin = new User({
      email: 'superadmin@laundry.com',
      password: 'SuperAdmin@123',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+639198765432',
      role: 'superadmin',
      status: 'active',
      isActive: true,
    });

    await superAdmin.save();
    console.log('\n✅ Super Admin account created successfully!');
    console.log('📧 Email: superadmin@laundry.com');
    console.log('🔑 Password: SuperAdmin@123');
    console.log('\n⚠️  IMPORTANT: Change this password in production!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
