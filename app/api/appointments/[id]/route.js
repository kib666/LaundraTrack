import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, rejectionReason } = body;
    
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { 
        status,
        ...(rejectionReason && { rejectionReason })
      }
    });
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[PATCH /api/appointments/[id]] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 