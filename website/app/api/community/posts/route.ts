import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/community/posts - List all posts (paginated)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let posts;
        if (category) {
            posts = await sql`
                SELECT 
                    p.id,
                    p.content,
                    p.image_url,
                    p.category,
                    p.likes_count,
                    p.comments_count,
                    p.created_at,
                    u.username
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.category = ${category}
                ORDER BY p.created_at DESC
                LIMIT ${limit}
                OFFSET ${offset}
            `;
        } else {
            posts = await sql`
                SELECT 
                    p.id,
                    p.content,
                    p.image_url,
                    p.category,
                    p.likes_count,
                    p.comments_count,
                    p.created_at,
                    u.username
                FROM posts p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
                LIMIT ${limit}
                OFFSET ${offset}
            `;
        }

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch posts',
                details: error instanceof Error ? error.message : String(error),
                diagnostics: {
                    hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
                }
            },
            { status: 500 }
        );
    }
}

// POST /api/community/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const { userId, content, imageUrl, category } = await request.json();

        if (!userId || !content) {
            return NextResponse.json(
                { error: 'User ID and content are required' },
                { status: 400 }
            );
        }

        const finalCategory = category || 'General';

        if (content.length > 500) {
            return NextResponse.json(
                { error: 'Content must be 500 characters or less' },
                { status: 400 }
            );
        }

        // ... (rate limiting logic omitted for brevity in multi-replace if possible, but I should probably keep it)
        // I'll include the whole chunk to be safe.


        // Check rate limiting
        const fingerprint = request.headers.get('x-fingerprint');
        if (fingerprint) {
            const rateLimitCheck = await sql`
                SELECT action_count, window_start
                FROM rate_limits
                WHERE fingerprint = ${fingerprint} 
                AND action_type = 'post'
            `;

            if (rateLimitCheck.length > 0) {
                const { action_count, window_start } = rateLimitCheck[0];
                const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

                if (new Date(window_start) > hourAgo) {
                    if (action_count >= 5) {
                        return NextResponse.json(
                            { error: 'Rate limit exceeded. Maximum 5 posts per hour.' },
                            { status: 429 }
                        );
                    }

                    // Increment count
                    await sql`
                        UPDATE rate_limits
                        SET action_count = action_count + 1
                        WHERE fingerprint = ${fingerprint} AND action_type = 'post'
                    `;
                } else {
                    // Reset window
                    await sql`
                        UPDATE rate_limits
                        SET action_count = 1, window_start = CURRENT_TIMESTAMP
                        WHERE fingerprint = ${fingerprint} AND action_type = 'post'
                    `;
                }
            } else {
                // Create rate limit entry
                await sql`
                    INSERT INTO rate_limits (id, fingerprint, action_type, action_count)
                    VALUES (${uuidv4()}, ${fingerprint}, 'post', 1)
                `;
            }
        }

        // Create post
        const newPost = await sql`
            INSERT INTO posts (id, user_id, content, image_url, category)
            VALUES (${uuidv4()}, ${userId}, ${content}, ${imageUrl || null}, ${finalCategory})
            RETURNING id, content, image_url, category, likes_count, comments_count, created_at
        `;

        // Get username
        const user = await sql`
            SELECT username FROM users WHERE id = ${userId} LIMIT 1
        `;

        return NextResponse.json({
            post: {
                ...newPost[0],
                username: user[0].username,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create post',
                details: error instanceof Error ? error.message : String(error),
                diagnostics: {
                    hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
                }
            },
            { status: 500 }

        );
    }
}


// DELETE /api/community/posts - Delete ALL posts (and related data)
export async function DELETE(request: NextRequest) {
    try {
        // Delete all likes (dependencies first)
        await sql`DELETE FROM likes`;

        // Delete all comments
        await sql`DELETE FROM comments`;

        // Delete all posts
        await sql`DELETE FROM posts`;

        // Delete all rate limits
        await sql`DELETE FROM rate_limits`;

        // Delete all users
        await sql`DELETE FROM users`;

        return NextResponse.json({ message: 'All community data (posts, comments, likes, users) deleted successfully' });
    } catch (error) {
        console.error('Delete all posts error:', error);
        return NextResponse.json(
            { error: 'Failed to delete data', details: String(error) },
            { status: 500 }
        );
    }
}
