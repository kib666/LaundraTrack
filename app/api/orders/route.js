// /app/api/orders/route.js (or .ts)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
    const { customerType, userId, customerName, phone, service, weight, deliveryAddress } = body;

    // Basic price calculation (example: $2.5 per kg)
    const pricePerKg = 2.5;
    const total = parseFloat(weight) * pricePerKg;
    
    // Estimate ETA (example: 3 days from now)
    const eta = new Date();
    eta.setDate(eta.getDate() + 3);

    let orderData = {
      service,
      weight: parseFloat(weight),
      status: 'Received',
      deliveryAddress,
      eta,
      total,
    };

    if (customerType === 'existing' && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      orderData.userId = userId;
      orderData.customer = user.name;
      orderData.phone = user.phoneNumber || '';
    } else {
      orderData.customer = customerName;
      orderData.phone = phone;
    }

    const order = await prisma.order.create({
      data: orderData
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
