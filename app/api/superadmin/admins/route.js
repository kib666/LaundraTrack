import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    // Apply auth middleware
    const authResult = await authMiddleware(request);
    if (!authResult.user) {
      return Response.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Check if user is superadmin
    const roleCheck = requireRole('superadmin');
    const roleCheckResult = roleCheck(authResult.user);
    if (roleCheckResult.error) {
      return Response.json({ error: roleCheckResult.error }, { status: 403 });
    }

    await connectDB();

    const admins = await User.find({ role: 'admin' }).select('-password');

    return Response.json({ admins });
  } catch (error) {
    console.error('Fetch admins error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Apply auth middleware
    const authResult = await authMiddleware(request);
    if (!authResult.user) {
      return Response.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Check if user is superadmin
    const roleCheck = requireRole('superadmin');
    const roleCheckResult = roleCheck(authResult.user);
    if (roleCheckResult.error) {
      return Response.json({ error: roleCheckResult.error }, { status: 403 });
    }

    const { firstName, lastName, email, phone, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    await newAdmin.save();

    const adminData = newAdmin.toObject();
    delete adminData.password;

    return Response.json(
      { message: 'Admin created successfully', admin: adminData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin error:', error.message, error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
