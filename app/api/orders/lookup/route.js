import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Prevent caching

// /api/orders/lookup?type=[email/phone]&q=[query]
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('q');

  if (!type || !query) {
    return NextResponse.json(
      { error: 'Missing search type or query' },
      { status: 400 }
    );
  }

  try {
    let order;
    if (type === 'order') {
      // This case is no longer used by the customer page, but kept for potential direct API use
      order = await prisma.order.findUnique({
        where: { id: query },
        include: { user: true },
      });
    } else if (type === 'phone' || type === 'email') {
      const whereClause =
        type === 'phone' ? { phone: query } : { email: query };
      
      const user = await prisma.user.findFirst({
        where: { ...whereClause, role: 'CUSTOMER' },
      });

      if (user) {
        order = await prisma.order.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          include: { user: true },
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
    }

    if (!order || !order.user) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Format the response to match what the frontend expects
    const formattedOrder = {
      id: order.id,
      customerName: order.user.name,
      customerPhone: order.user.phone,
      weight: order.weight,
      total: order.total,
      status: order.status,
      eta: order.eta,
      createdAt: order.createdAt,
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error looking up order:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
} 