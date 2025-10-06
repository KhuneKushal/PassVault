import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

export function generateToken(userId) {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  const secret = getJwtSecret();
  if (!secret) {
    // Can't verify without a secret; return null so callers treat as unauthenticated
    console.warn('verifyToken called but JWT_SECRET is not set');
    return null;
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const secret = getJwtSecret();
  if (!secret) {
    console.warn('getAuthUser: JWT_SECRET is not set');
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(request) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  const secret = getJwtSecret();
  if (!secret) {
    console.warn('authenticateUser: JWT_SECRET is not set');
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}