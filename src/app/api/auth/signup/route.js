import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      hashedPassword: hashedPassword,
    });

    // In a real app, you'd also create a session/JWT here
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    const errorMessage = process.env.PV_DEBUG === 'true' ? error.message : 'An internal server error occurred';
    console.error('Signup Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}