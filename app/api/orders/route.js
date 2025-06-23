// /app/api/orders/route.js (or .ts)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[GET /api/orders] Error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      customerType, 
      userId, 
      customerName, 
      phone, 
      service, 
      weight, 
      deliveryAddress, 
      eta 
    } = body;

    let customerId = userId;

    // Create a new user if the customer is new
    if (customerType === 'new' && customerName && phone) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      const newUser = await prisma.user.create({
        data: {
          name: customerName,
          phoneNumber: phone,
          email: `${phone}@placeholder.com`, // Create a placeholder email
          password: hashedPassword, // Create a random password
          role: 'CUSTOMER',
        },
      });
      customerId = newUser.id;
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 });
    }

    // Calculate total price (example calculation)
    const pricePerKg = 40; // Example price
    const total = parseFloat(weight) * pricePerKg;

    const newOrder = await prisma.order.create({
      data: {
        userId: customerId,
        service,
        weight: parseFloat(weight),
        deliveryAddress,
        status: 'PENDING',
        eta: new Date(eta),
        total,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/orders] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
