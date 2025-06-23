import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`[GET /api/orders/[id]] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const { service, weight, deliveryAddress, status, eta, total, notes } = body;
    const dataToUpdate = {
      service,
      deliveryAddress,
      status,
      notes,
    };

    if (weight) {
      dataToUpdate.weight = parseFloat(weight);
    }
    if (total) {
      dataToUpdate.total = parseFloat(total);
    }
    if (eta) {
      dataToUpdate.eta = new Date(eta);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`[PATCH /api/orders/[id]] Error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
} 