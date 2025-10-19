import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set (fail fast in production)
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export function verifyToken(token) {
  try {
    console.log(
      '[VERIFY TOKEN] Attempting to verify token, length:',
      token ? token.length : 'null'
    );
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[VERIFY TOKEN] Token verified successfully, decoded userId:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('[VERIFY TOKEN] Verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode JWT Token (without verification)
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export function extractToken(authHeader) {
  console.log('[EXTRACT TOKEN] Input authHeader:', authHeader ? 'present' : 'null/undefined');
  if (authHeader) {
    console.log('[EXTRACT TOKEN] authHeader type:', typeof authHeader);
    console.log('[EXTRACT TOKEN] authHeader length:', authHeader.length);
    console.log('[EXTRACT TOKEN] authHeader first 30 chars:', authHeader.substring(0, 30));
    console.log(
      '[EXTRACT TOKEN] Checking startsWith("Bearer "):',
      authHeader.startsWith('Bearer ')
    );
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[EXTRACT TOKEN] Failed - returning null');
    return null;
  }

  const token = authHeader.substring(7);
  console.log('[EXTRACT TOKEN] Success - token length:', token.length);
  return token;
}
