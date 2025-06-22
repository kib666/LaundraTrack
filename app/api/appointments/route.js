// app/api/appointments/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[GET /api/appointments] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, phone, date, service, notes, status } = body;
    
    const appointment = await prisma.appointment.create({
      data: {
        customer,
        phone,
        date: new Date(date),
        service,
        notes,
        status
      }
    });
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[POST /api/appointments] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
