import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, phoneNumber } = await request.json();

    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber: phoneNumber }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/auth/register] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 