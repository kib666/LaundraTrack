import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET all users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const whereClause = role ? { role } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('[GET /api/users] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, phoneNumber } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing name, email, or role' }, { status: 400 });
    }
     if (!password && role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Password is required for non-customer roles' }, { status: 400 });
    }

    const data = {
      name,
      email,
      role,
      phoneNumber,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    } else {
      // Generate a random password for customers if not provided
      data.password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
    }

    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('[POST /api/users] Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 