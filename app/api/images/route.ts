import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Liste toutes les images du dossier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'elegance-couture';
    const limit = parseInt(searchParams.get('limit') || '50');
    const nextCursor = searchParams.get('nextCursor') || undefined;

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: limit,
      next_cursor: nextCursor,
    });

    return NextResponse.json({
      images: result.resources.map((resource: any) => ({
        id: resource.asset_id,
        publicId: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        bytes: resource.bytes,
        createdAt: resource.created_at,
      })),
      nextCursor: result.next_cursor,
    });
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des images' },
      { status: 500 }
    );
  }
}

// DELETE - Supprime une image
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const isValid = validateAdminToken(request);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token invalide ou non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'ID de l\'image requis' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw new Error('Échec de la suppression');
    }

    return NextResponse.json({ success: true, message: 'Image supprimée' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression de l\'image' },
      { status: 500 }
    );
  }
}
