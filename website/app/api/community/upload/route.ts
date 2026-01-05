import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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

        // Upload to Vercel Blob
        console.log('Uploading to Vercel Blob...');
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        console.log('Blob upload successful:', blob.url);

        return NextResponse.json({
            imageUrl: blob.url,
        });

    } catch (error) {
        console.error('SERVER-SIDE UPLOAD ERROR:', error);
        return NextResponse.json(
            {
                error: 'Failed to upload image',
                details: error instanceof Error ? error.message : String(error),
                diagnostics: {
                    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
                }
            },
            { status: 500 }
        );
    }
}
