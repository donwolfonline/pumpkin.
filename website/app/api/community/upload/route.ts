import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (max 4.5MB for Vercel Hobby limits)
        const maxSize = 4.5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size too large. Maximum 4.5MB allowed.' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUrl, {
            folder: 'pumpkin_community',
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' },
            ],
        });

        return NextResponse.json({
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });

    } catch (error) {
        console.error('SERVER-SIDE UPLOAD ERROR:', error);
        return NextResponse.json(
            {
                error: 'Failed to upload image',
                details: error instanceof Error ? error.message : String(error),
                diagnostics: {
                    hasCloudName: !!(process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
                    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
                    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
                }
            },
            { status: 500 }
        );
    }
}
