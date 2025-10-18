import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoUri = 'mongodb+srv://iankurbyplacencia30:Vw0y66M6AlUmjaFI@expressdb.ccixe.mongodb.net/laudratrack?retryWrites=true&w=majority&appName=expressdb';

async function createStaff() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
      status: { type: String, enum: ['pending', 'approved', 'rejected', 'active'], default: 'pending' },
      isActive: { type: Boolean, default: true },
    }, { timestamps: true });

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

    // Check if staff already exists
    const existingStaff = await User.findOne({ email: 'staff@laundry.com' });
    if (existingStaff) {
      console.log('✅ Staff member already exists!');
      console.log('📧 Email: staff@laundry.com');
      console.log('🔑 Password: Staff@123');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create staff user
    const staff = new User({
      email: 'staff@laundry.com',
      password: 'Staff@123',
      firstName: 'Staff',
      lastName: 'Member',
      phone: '+639987654321',
      role: 'staff',
      status: 'active',
      isActive: true,
    });

    await staff.save();
    console.log('\n✅ Staff account created successfully!');
    console.log('📧 Email: staff@laundry.com');
    console.log('🔑 Password: Staff@123');
    console.log('\n⚠️  IMPORTANT: Change this password in production!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createStaff();