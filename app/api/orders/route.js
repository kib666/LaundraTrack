// /app/api/orders/route.js (or .ts)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      customerPhone,
      customerEmail, // Added email
      notes,
      service, // Added service
      // Default values for fields not provided by customer form
      weight = 0,
      total, // Allow total to be undefined
      status = 'PENDING',
      eta = null,
      deliveryAddress
    } = body;

    let finalCustomerId;

    if (customerType === 'existing' && userId) {
      finalCustomerId = userId;
    } else {
      let user = await prisma.user.findFirst({
        where: { OR: [{ email: customerEmail }, { phoneNumber: customerPhone }] },
      });

      if (user) {
        finalCustomerId = user.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            name: customerName,
            email: customerEmail,
            phoneNumber: customerPhone,
            role: 'CUSTOMER',
          },
        });
        finalCustomerId = newUser.id;
      }
    }
    
    const weightFloat = parseFloat(weight);
    let finalTotal = parseFloat(total);

    if (isNaN(finalTotal)) {
        const serviceData = {
            'Wash & Fold': 40,
            'Dry Cleaning': 150,
            'Wash & Iron': 80,
            'Express Service': 100
        };
        const pricePerUnit = serviceData[service] || 40;
        finalTotal = service === 'Express Service' 
            ? (weightFloat * serviceData['Wash & Fold']) + pricePerUnit 
            : weightFloat * pricePerUnit;
    }

    const order = await prisma.order.create({
      data: {
        weight: weightFloat,
        total: finalTotal,
        status: status,
        service: service || 'Wash & Fold',
        eta: eta ? new Date(eta) : null,
        deliveryAddress,
        notes,
        userId: finalCustomerId,
      },
      include: {
        user: true,
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
