import { v2 as cloudinary } from 'cloudinary';
import { readdir, stat, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { validateAdminToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasCloudinaryConfig = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

function sanitizeFolder(folder: string): string {
  return folder
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(Boolean)
    .join('/');
}

async function listLocalImages(folder: string) {
  const safeFolder = sanitizeFolder(folder);
  const uploadRoot = path.join(process.cwd(), 'public', 'uploads', safeFolder);
  const images: any[] = [];

  async function walk(dir: string) {
    let entries: string[] = [];
    try {
      entries = await readdir(dir);
    } catch {
      return;
    }

    await Promise.all(entries.map(async (entry) => {
      const absolutePath = path.join(dir, entry);
      const info = await stat(absolutePath);

      if (info.isDirectory()) {
        await walk(absolutePath);
        return;
      }

      if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(entry)) return;

      const relativePath = path.relative(path.join(process.cwd(), 'public', 'uploads'), absolutePath).split(path.sep).join('/');
      const publicId = relativePath.replace(/\.[^/.]+$/, '');

      images.push({
        id: publicId,
        publicId,
        url: `/uploads/${relativePath}`,
        format: path.extname(entry).slice(1).toLowerCase(),
        width: 0,
        height: 0,
        bytes: info.size,
        createdAt: info.birthtime.toISOString(),
      });
    }));
  }

  await walk(uploadRoot);
  return images.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

// GET - Liste toutes les images du dossier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'elegance-couture';
    const limit = parseInt(searchParams.get('limit') || '50');
    const nextCursor = searchParams.get('nextCursor') || undefined;

    if (!hasCloudinaryConfig) {
      const images = await listLocalImages(folder);
      return NextResponse.json({
        images: images.slice(0, limit),
        nextCursor: null,
      });
    }

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

    if (!hasCloudinaryConfig) {
      const safePublicId = sanitizeFolder(publicId);
      const uploadRoot = path.join(process.cwd(), 'public', 'uploads');
      const localPath = path.join(uploadRoot, safePublicId);
      const resolvedPath = path.resolve(localPath);
      const resolvedRoot = path.resolve(uploadRoot);

      if (!resolvedPath.startsWith(resolvedRoot)) {
        return NextResponse.json(
          { error: 'ID de l\'image invalide' },
          { status: 400 }
        );
      }

      const candidates = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].map((extension) => `${resolvedPath}${extension}`);
      for (const candidate of candidates) {
        try {
          await unlink(candidate);
          return NextResponse.json({ success: true, message: 'Image supprimée' });
        } catch {
          // Try the next possible extension.
        }
      }

      return NextResponse.json(
        { error: 'Image introuvable' },
        { status: 404 }
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
