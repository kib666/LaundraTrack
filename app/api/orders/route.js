// app/api/orders/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany();
  return NextResponse.json(orders);
}
