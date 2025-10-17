import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return Response.json(
        { success: false, message: 'Your account has been deactivated' },
        { status: 403 }
      );
    }

    // Check if user is approved (for staff/admin)
    if (user.role !== 'customer' && user.status !== 'active') {
      return Response.json(
        {
          success: false,
          message: `Your account is ${user.status === 'pending' ? 'pending approval' : user.status}`,
        },
        { status: 403 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return Response.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return Response.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, message: 'Login failed', error: error.message },
      { status: 500 }
    );
  }
}