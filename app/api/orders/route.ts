import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAdminToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { orderSchema } from '@/lib/validations';

// GET all orders - requires admin authentication
export async function GET(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(ip, 30, 60000); // 30 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    // Validate admin token
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status } : {};
    
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

// PATCH update order status - requires admin authentication
export async function PATCH(request: NextRequest) {
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
    
    // Validate admin token
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { id, status } = data;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID et statut requis' },
        { status: 400 }
      );
    }
    
    // Valid statuses
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }
    
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Statut mis à jour',
      order
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// POST create new order - public endpoint (customers can create orders)
export async function POST(request: NextRequest) {
  try {
    // Rate limit check - stricter for order creation
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(ip, 5, 60000); // 5 orders per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    const data = await request.json();
    
    // Validate with Zod
    const validationResult = orderSchema.safeParse(data);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }
    
    const order = await prisma.order.create({
      data: {
        customerNom: validationResult.data.customer.nom,
        customerPrenom: validationResult.data.customer.prenom,
        customerEmail: validationResult.data.customer.email,
        customerTelephone: validationResult.data.customer.telephone,
        customerAdresse: validationResult.data.customer.adresse || '',
        customerVille: validationResult.data.customer.ville || '',
        customerQuartier: validationResult.data.customer.quartier || '',
        customerInstructions: validationResult.data.customer.instructions || '',
        items: validationResult.data.items,
        total: validationResult.data.total || 0,
        fraisLivraison: validationResult.data.fraisLivraison || 0,
        totalFinal: validationResult.data.totalFinal || 0,
        paiement: validationResult.data.paiement || 'cash',
        status: 'pending',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Commande enregistrée avec succès',
      order
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'enregistrement de la commande' },
      { status: 500 }
    );
  }
}
