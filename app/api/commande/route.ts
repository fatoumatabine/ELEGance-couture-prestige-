import { NextRequest, NextResponse } from 'next/server';

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface OrderData {
  customer: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    adresse: string;
    ville: string;
    quartier: string;
    instructions?: string;
  };
  items: OrderItem[];
  total: number;
  fraisLivraison: number;
  totalFinal: number;
  paiement: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderData = await request.json();

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(data);

    // Send email using Resend
    const emailResult = await sendInvoiceEmail(data.customer.email, invoiceHtml, data);

    return NextResponse.json({
      success: true,
      message: 'Email de facture envoyé',
      emailResult
    });
  } catch (error: any) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}

function generateInvoiceHtml(data: OrderData): string {
  const { customer, items, total, fraisLivraison, totalFinal } = data;
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = items.map((item, index) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px 10px;">${index + 1}</td>
      <td style="padding: 15px 10px;">
        <img src="${item.product.images[0]?.replace('http://', 'https://') || ''}" 
             alt="${item.product.name}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
      </td>
      <td style="padding: 15px 10px;">
        <strong>${item.product.name}</strong><br/>
        <small style="color: #666;">${item.product.category}</small><br/>
        ${item.selectedSize ? `<span style="color: #666;">Taille: ${item.selectedSize}</span><br/>` : ''}
        ${item.selectedColor ? `<span style="color: #666;">Couleur: ${item.selectedColor}</span>` : ''}
      </td>
      <td style="padding: 15px 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px 10px; text-align: right;">${item.product.price.toLocaleString()} CFA</td>
      <td style="padding: 15px 10px; text-align: right;"><strong>${(item.product.price * item.quantity).toLocaleString()} CFA</strong></td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture - Elegance Couture Prestige</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <!-- Header with Logo -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 40px 30px; text-align: center;">
      <img src="https://res.cloudinary.com/dl35ypk2p/image/upload/v1/public/logo.png" 
           alt="Elegance Couture Prestige" 
           style="max-width: 200px; height: auto; margin-bottom: 10px;" />
      <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">Mode Africaine de Luxe</p>
    </div>

    <!-- Invoice Info -->
    <div style="padding: 30px; border-bottom: 2px solid #f0f0f0;">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div>
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Facture N°</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #C9A96E;">ECP-${Date.now().toString().slice(-8)}</p>
        </div>
        <div>
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Date</p>
          <p style="margin: 5px 0 0; font-size: 14px;">${date}</p>
        </div>
      </div>
    </div>

    <!-- Customer Info -->
    <div style="padding: 30px; border-bottom: 2px solid #f0f0f0;">
      <h3 style="margin: 0 0 15px; color: #1a1a1a;">Informations Client</h3>
      <p style="margin: 5px 0; color: #333;">
        <strong>${customer.prenom} ${customer.nom}</strong>
      </p>
      <p style="margin: 5px 0; color: #666;">📱 ${customer.telephone}</p>
      <p style="margin: 5px 0; color: #666;">📧 ${customer.email}</p>
      <p style="margin: 5px 0; color: #666;">📍 ${customer.adresse}, ${customer.quartier}, ${customer.ville}</p>
    </div>

    <!-- Items Table -->
    <div style="padding: 30px;">
      <h3 style="margin: 0 0 20px; color: #1a1a1a;">Détails de la Commande</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9f9f9;">
            <th style="padding: 15px 10px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">#</th>
            <th style="padding: 15px 10px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">Image</th>
            <th style="padding: 15px 10px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">Produit</th>
            <th style="padding: 15px 10px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase;">Qté</th>
            <th style="padding: 15px 10px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Prix Unit.</th>
            <th style="padding: 15px 10px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="padding: 30px; background: #f9f9f9;">
      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 250px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666;">
            <span>Sous-total</span>
            <span>${total.toLocaleString()} CFA</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #666;">
            <span>Livraison</span>
            <span>${fraisLivraison.toLocaleString()} CFA</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #ddd; font-size: 20px; font-weight: bold; color: #C9A96E;">
            <span>Total</span>
            <span>${totalFinal.toLocaleString()} CFA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Info -->
    <div style="padding: 30px; border-top: 2px solid #f0f0f0;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        <strong>Mode de paiement:</strong> ${data.paiement === 'cash' ? 'Paiement à la livraison' : 'Virement bancaire'}
      </p>
      ${customer.instructions ? `
      <p style="margin: 10px 0 0; color: #666; font-size: 14px;">
        <strong>Instructions:</strong> ${customer.instructions}
      </p>
      ` : ''}
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; color: white; padding: 30px; text-align: center;">
      <img src="https://res.cloudinary.com/dl35ypk2p/image/upload/v1/public/logo.png" 
           alt="Elegance Couture Prestige" 
           style="max-width: 120px; height: auto; margin-bottom: 15px; opacity: 0.9;" />
      <p style="margin: 0 0 10px; font-size: 14px;">Merci pour votre confiance !</p>
      <p style="margin: 0; font-size: 12px; opacity: 0.7;">
        Grand Dakar, Thiossane<br/>
        contact@elegancecouture.sn - +221 78 112 81 37
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Send invoice email using Resend API
async function sendInvoiceEmail(email: string, html: string, data: OrderData): Promise<any> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Elegance Couture <onboarding@resend.dev>',
        to: email,
        subject: `Facture #ECP-${Date.now().toString().slice(-8)} - Elegance Couture Prestige`,
        html: html
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Resend API error:', result);
      return { success: false, error: result };
    }

    console.log('✅ Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}
