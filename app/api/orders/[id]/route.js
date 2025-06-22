import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    
    return Response.json(order);
  } catch (error) {
    console.error('[PATCH /api/orders/[id]] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 