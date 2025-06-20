// app/api/appointments/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const appointments = await prisma.appointment.findMany();
  return NextResponse.json(appointments);
}
