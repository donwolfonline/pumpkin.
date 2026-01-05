import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET /api/community/posts/:id - Get single post with comments
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get post
        const posts = await sql`
            SELECT 
                p.id,
                p.content,
                p.image_url,
                p.likes_count,
                p.comments_count,
                p.created_at,
                u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ${id}
            LIMIT 1
        `;

        if (posts.length === 0) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Get comments
        const comments = await sql`
            SELECT 
                c.id,
                c.content,
                c.likes_count,
                c.created_at,
                u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ${id}
            ORDER BY c.created_at ASC
        `;

        return NextResponse.json({
            post: posts[0],
            comments,
        });

    } catch (error) {
        console.error('Get post error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}
