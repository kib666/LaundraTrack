// /app/api/orders/route.js (or .ts)
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    return Response.json(orders);
  } catch (error) {
    console.error('[GET /api/orders] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
