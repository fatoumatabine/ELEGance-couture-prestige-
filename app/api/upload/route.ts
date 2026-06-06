import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { validateAdminToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration des types de fichiers autorisés
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

// Taille maximale: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const hasCloudinaryConfig = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Fonction de validation du fichier
function validateFile(file: File): { valid: boolean; error: string } {
  // Vérifier le type MIME
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés: JPEG, PNG, WebP, GIF, SVG`
    };
  }

  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximale: 10MB`
    };
  }

  return { valid: true, error: '' };
}

function sanitizeFolder(folder: string): string {
  return folder
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(Boolean)
    .join('/');
}

function getFileExtension(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }

  return file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const isValid = validateAdminToken(request);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token invalide ou non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'elegance-couture/products';

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Valider le fichier
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!hasCloudinaryConfig) {
      const safeFolder = sanitizeFolder(folder);
      const extension = getFileExtension(file);
      const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
      const uploadPath = path.join(uploadDir, fileName);
      const publicUrl = `/uploads/${safeFolder}/${fileName}`;

      await mkdir(uploadDir, { recursive: true });
      await writeFile(uploadPath, buffer);

      return NextResponse.json({
        asset_id: fileName,
        public_id: `${safeFolder}/${fileName}`,
        secure_url: publicUrl,
        url: publicUrl,
        format: extension,
        bytes: file.size,
        created_at: new Date().toISOString(),
        storage: 'local',
      });
    }

    // Upload to Cloudinary avec optimisation
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      uploadStream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Échec de l\'upload' },
      { status: 500 }
    );
  }
}
