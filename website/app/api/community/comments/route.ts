import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// POST /api/community/comments - Create new comment
export async function POST(request: NextRequest) {
    try {
        const { userId, postId, content } = await request.json();

        if (!userId || !postId || !content) {
            return NextResponse.json(
                { error: 'User ID, post ID, and content are required' },
                { status: 400 }
            );
        }

        if (content.length > 200) {
            return NextResponse.json(
                { error: 'Comment must be 200 characters or less' },
                { status: 400 }
            );
        }

        // Check if post exists
        const postExists = await sql`
            SELECT id FROM posts WHERE id = ${postId} LIMIT 1
        `;

        if (postExists.length === 0) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Create comment
        const newComment = await sql`
            INSERT INTO comments (id, post_id, user_id, content)
            VALUES (${uuidv4()}, ${postId}, ${userId}, ${content})
            RETURNING id, content, likes_count, created_at
        `;

        // Increment post's comment count
        await sql`
            UPDATE posts
            SET comments_count = comments_count + 1
            WHERE id = ${postId}
        `;

        // Get username
        const user = await sql`
            SELECT username FROM users WHERE id = ${userId} LIMIT 1
        `;

        return NextResponse.json({
            comment: {
                ...newComment[0],
                post_id: postId,
                username: user[0].username,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Create comment error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create comment',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
