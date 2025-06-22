// /app/api/orders/route.js (or .ts)
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return Response.json(orders);
  } catch (error) {
    console.error('[GET /api/orders] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, phone, weight, status, eta, total } = body;
    
    const order = await prisma.order.create({
      data: {
        customer,
        phone,
        weight,
        status,
        eta: new Date(eta),
        total: parseFloat(total)
      }
    });
    
    return Response.json(order);
  } catch (error) {
    console.error('[POST /api/orders] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
