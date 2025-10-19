import { verifyToken, extractToken } from './jwt';
import { User } from '../db/models';

/**
 * Middleware to verify JWT token
 * Sets req.user if token is valid
 */
export async function authMiddleware(req) {
  try {
    const authHeader = req.headers.get
      ? req.headers.get('authorization')
      : req.headers.authorization;

    console.log('[AUTH MIDDLEWARE] Received auth header:', authHeader ? 'present' : 'missing');
    if (authHeader) {
      console.log('[AUTH MIDDLEWARE] Auth header format:', authHeader.substring(0, 20) + '...');
    }

    const token = extractToken(authHeader);
    if (!token) {
      console.log('[AUTH MIDDLEWARE] Token extraction failed - authHeader was:', authHeader);
      return {
        error: 'No token provided',
        status: 401,
      };
    }

    console.log('[AUTH MIDDLEWARE] Token successfully extracted, verifying...');

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        error: 'User not found',
        status: 404,
      };
    }

    if (!user.isActive) {
      return {
        error: 'User account is inactive',
        status: 403,
      };
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    return {
      error: error.message || 'Invalid token',
      status: 401,
    };
  }
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(...roles) {
  return (user) => {
    if (!user || !roles.includes(user.role)) {
      return {
        error: 'Access denied. Required role not found.',
        status: 403,
      };
    }
    return { user };
  };
}

/**
 * Middleware to check if user is approved
 */
export function requireApproval(user) {
  if (!user || user.status !== 'active') {
    return {
      error: 'Your account is not approved yet or has been suspended.',
      status: 403,
    };
  }
  return { user };
}
