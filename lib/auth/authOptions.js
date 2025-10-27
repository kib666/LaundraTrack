import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { generateToken } from '@/lib/auth/jwt';

const SUPER_ADMIN_CREDENTIALS = {
  email: 'super@gmail.com',
  password: 'superadmin123',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'superadmin',
  status: 'active',
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        portalType: { label: 'Portal Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const normalizedEmail = credentials.email.trim().toLowerCase();
          const normalizedPassword = credentials.password;
          const normalizedPortalType = credentials.portalType?.trim().toLowerCase();

          const isSuperAdmin =
            normalizedEmail === SUPER_ADMIN_CREDENTIALS.email &&
            normalizedPassword === SUPER_ADMIN_CREDENTIALS.password;

          if (isSuperAdmin) {
            if (normalizedPortalType && normalizedPortalType !== 'admin') {
              throw new Error('Super admin can only access the admin portal.');
            }

            const token = generateToken('super-admin', SUPER_ADMIN_CREDENTIALS.role);

            return {
              id: 'super-admin',
              email: SUPER_ADMIN_CREDENTIALS.email,
              name: `${SUPER_ADMIN_CREDENTIALS.firstName} ${SUPER_ADMIN_CREDENTIALS.lastName}`,
              firstName: SUPER_ADMIN_CREDENTIALS.firstName,
              lastName: SUPER_ADMIN_CREDENTIALS.lastName,
              role: SUPER_ADMIN_CREDENTIALS.role,
              status: SUPER_ADMIN_CREDENTIALS.status,
              token,
            };
          }

          await connectDB();

          // Find user by email
          const user = await User.findOne({ email: normalizedEmail });
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error('Your account has been deactivated');
          }

          // Compare password
          const isPasswordValid = await user.comparePassword(normalizedPassword);
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Validate role matches portal type (CRITICAL: Prevent cross-login)
          if (normalizedPortalType) {
            // Map portal types to required user roles
            const portalRoleMap = {
              admin: ['admin', 'superadmin'],
              staff: ['staff'],
              customer: ['customer'],
            };

            const allowedRoles = portalRoleMap[normalizedPortalType];
            if (allowedRoles && !allowedRoles.includes(user.role)) {
              throw new Error(
                `Invalid credentials for ${normalizedPortalType} portal. Your role is ${user.role}, but this portal is for ${allowedRoles.join(' / ')}s only.`
              );
            }
          }

          // Check if user is approved (for staff/admin)
          if (user.role !== 'customer' && user.status !== 'active') {
            throw new Error(
              `Your account is ${user.status === 'pending' ? 'pending approval' : user.status}`
            );
          }

          // Generate JWT token
          const token = generateToken(user._id, user.role);

          // Return user object to be stored in session
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            token,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  pages: {
    signIn: '/customer',
    error: '/customer',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.status = user.status;
        token.jwtToken = user.token;
        console.log('JWT Callback - User logged in:', { email: user.email, role: user.role });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.token = token.jwtToken;
        console.log('Session Callback - Session created:', {
          email: session.user.email,
          role: session.user.role,
        });
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
