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
    const {
      customerType,
      customerId, // Use customerId for clarity
      customerName,
      customerPhone,
      customerEmail, // Added email
      notes,
      // Default values for fields not provided by customer form
      weight = 0,
      total = 0,
      status = 'PENDING',
      eta = null,
    } = body;

    let finalCustomerId;

    if (customerType === 'existing' && customerId) {
      // Logic for existing customer (used by admin form)
      finalCustomerId = customerId;
    } else {
      // Logic for new customer (used by customer schedule pickup form)
      // We can also check if a user with this email or phone already exists
      let user = await prisma.user.findFirst({
        where: { OR: [{ email: customerEmail }, { phone: customerPhone }] },
      });

      if (user) {
        // User exists, link the order to them
        finalCustomerId = user.id;
      } else {
        // User does not exist, create a new one
        const newUser = await prisma.user.create({
          data: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            role: 'CUSTOMER',
          },
        });
        finalCustomerId = newUser.id;
      }
    }

    const order = await prisma.order.create({
      data: {
        weight: parseFloat(weight),
        total: parseFloat(total),
        status,
        eta: eta ? new Date(eta) : null,
        notes,
        customerId: finalCustomerId,
      },
      include: {
        customer: true, // Return the full customer details
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders] Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email or phone number already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
