import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!process.env.NEXT_PUBLIC_ENCRYPTION_SALT) missing.push('NEXT_PUBLIC_ENCRYPTION_SALT');

  const result = {
    env: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NEXT_PUBLIC_ENCRYPTION_SALT: !!process.env.NEXT_PUBLIC_ENCRYPTION_SALT,
    },
    db: null,
    missingEnv: missing,
  };

  if (missing.length > 0) {
    return NextResponse.json(result, { status: 500 });
  }

  try {
    await dbConnect();
    result.db = 'connected';
    return NextResponse.json(result);
  } catch (err) {
    result.db = `error: ${err.message}`;
    return NextResponse.json(result, { status: 500 });
  }
}
