import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAdminToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { contactSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(ip, 30, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    // Validate admin token for viewing contacts
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}

// POST - public endpoint for submitting contact form
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(ip, 3, 60000); // 3 messages per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    const data = await request.json();
    
    // Validate with Zod
    const validationResult = contactSchema.safeParse(data);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }
    
    const contact = await prisma.contact.create({
      data: {
        nom: validationResult.data.nom,
        email: validationResult.data.email,
        telephone: validationResult.data.telephone || '',
        sujet: validationResult.data.sujet || 'Sans sujet',
        message: validationResult.data.message,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message enregistré avec succès',
      contact
    });
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'enregistrement du message' },
      { status: 500 }
    );
  }
}
