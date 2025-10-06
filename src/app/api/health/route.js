import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';

export async function GET() {
  const checks = {
    mongodb_uri: false,
    jwt_secret: false,
    db_connection: false,
    timestamp: new Date().toISOString(),
  };

  // Check for environment variables
  if (process.env.MONGODB_URI) {
    checks.mongodb_uri = true;
  }

  if (process.env.JWT_SECRET) {
    checks.jwt_secret = true;
  }

  // Check database connection
  try {
    await dbConnect();
    checks.db_connection = true;
  } catch (error) {
    checks.db_connection = false;
    console.error('Health check DB connection error:', error);
  }

  const all_ok = Object.values(checks).every(v => v === true || typeof v === 'string');
  const status = all_ok ? 200 : 500;

  return NextResponse.json(checks, { status });
}