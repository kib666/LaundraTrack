import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://iankurbyplacencia30:Vw0y66M6AlUmjaFI@expressdb.ccixe.mongodb.net/laudratrack?retryWrites=true&w=majority&appName=expressdb';

async function verifyAdmin() {
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

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Find admin user
    const admin = await User.findOne({ email: 'admin@laundry.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('\n📋 Current Admin User Data:');
    console.log('Email:', admin.email);
    console.log('Name:', `${admin.firstName} ${admin.lastName}`);
    console.log('Role:', admin.role);
    console.log('Status:', admin.status);
    console.log('IsActive:', admin.isActive);

    // Update role to admin if it's not already
    if (admin.role !== 'admin') {
      admin.role = 'admin';
      admin.status = 'active';
      await admin.save();
      console.log('\n✅ Admin role updated successfully!');
    } else {
      console.log('\n✅ Admin role is already set to admin!');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAdmin();