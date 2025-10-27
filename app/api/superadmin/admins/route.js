import { User } from '@/lib/db/models';
import { connectDB } from '@/lib/db/mongodb';
import jwt from 'jsonwebtoken';

// Middleware to verify super admin token
async function verifySuperAdmin(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    if (decoded.role !== 'superadmin') {
      return { valid: false, error: 'Insufficient permissions' };
    }

    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: 'Invalid or expired token' };
  }
}

// GET all admins
export async function GET(request) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.valid) {
      return Response.json({ message: auth.error }, { status: 401 });
    }

    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });

    return Response.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return Response.json({ message: 'An error occurred while fetching admins' }, { status: 500 });
  }
}

// POST create admin
export async function POST(request) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.valid) {
      return Response.json({ message: auth.error }, { status: 401 });
    }

    const { firstName, lastName, email, password } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json({ message: 'Email already exists' }, { status: 409 });
    }

    // Create new admin
    const newAdmin = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by the model's pre-save hook
      role: 'admin',
      status: 'active',
      isActive: true,
    });

    await newAdmin.save();

    const adminData = newAdmin.toJSON();
    adminData.id = newAdmin._id;

    return Response.json(
      {
        success: true,
        message: 'Admin created successfully',
        admin: adminData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return Response.json({ message: 'An error occurred while creating admin' }, { status: 500 });
  }
}
