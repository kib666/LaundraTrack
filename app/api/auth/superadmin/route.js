import { generateToken } from '@/lib/auth/jwt';

const SUPER_ADMIN_CREDENTIALS = {
  email: 'super@gmail.com',
  password: 'superadmin123',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'superadmin',
  status: 'active',
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;

    const isSuperAdmin =
      normalizedEmail === SUPER_ADMIN_CREDENTIALS.email &&
      normalizedPassword === SUPER_ADMIN_CREDENTIALS.password;

    if (!isSuperAdmin) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken('super-admin', SUPER_ADMIN_CREDENTIALS.role);

    return Response.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: 'super-admin',
        email: SUPER_ADMIN_CREDENTIALS.email,
        firstName: SUPER_ADMIN_CREDENTIALS.firstName,
        lastName: SUPER_ADMIN_CREDENTIALS.lastName,
        role: SUPER_ADMIN_CREDENTIALS.role,
        status: SUPER_ADMIN_CREDENTIALS.status,
      },
    });
  } catch (error) {
    console.error('Super admin login error:', error);
    return Response.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
