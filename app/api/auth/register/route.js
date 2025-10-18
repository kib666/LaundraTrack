import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { generateToken } from '@/lib/auth/jwt';
import { isValidEmail, isStrongPassword } from '@/lib/validators';

export async function POST(request) {
  try {
    await connectDB();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      role = 'customer',
    } = await request.json();

    // Validation
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
      return Response.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return Response.json({ success: false, message: 'Passwords do not match' }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return Response.json(
        {
          success: false,
          message: 'Password must be at least 6 characters',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role === 'staff' ? 'staff' : 'customer',
      status: role === 'staff' ? 'pending' : 'active', // Staff needs approval
      isActive: true,
    });

    await user.save();

    // Generate token (only for customers, staff need admin approval)
    let token = null;
    if (user.role === 'customer') {
      token = generateToken(user._id, user.role);
    }

    return Response.json(
      {
        success: true,
        message:
          user.role === 'staff'
            ? 'Staff registration submitted. Awaiting admin approval.'
            : 'Registration successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        token: token || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { success: false, message: 'Registration failed', error: error.message },
      { status: 500 }
    );
  }
}
