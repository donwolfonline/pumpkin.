import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// POST /api/community/likes - Toggle like on post or comment
export async function POST(request: NextRequest) {
    try {
        const { userId, targetType, targetId } = await request.json();

        if (!userId || !targetType || !targetId) {
            return NextResponse.json(
                { error: 'User ID, target type, and target ID are required' },
                { status: 400 }
            );
        }

        if (!['post', 'comment'].includes(targetType)) {
            return NextResponse.json(
                { error: 'Target type must be "post" or "comment"' },
                { status: 400 }
            );
        }

        // Check if already liked
        const existingLike = await sql`
            SELECT id FROM likes
            WHERE user_id = ${userId}
            AND target_type = ${targetType}
            AND target_id = ${targetId}
            LIMIT 1
        `;

        if (existingLike.length > 0) {
            // Unlike - remove like
            await sql`
                DELETE FROM likes
                WHERE id = ${existingLike[0].id}
            `;

            let result;
            if (targetType === 'post') {
                await sql`
                    UPDATE posts
                    SET likes_count = GREATEST(likes_count - 1, 0)
                    WHERE id = ${targetId}
                `;
                result = await sql`SELECT likes_count FROM posts WHERE id = ${targetId} LIMIT 1`;
            } else {
                await sql`
                    UPDATE comments
                    SET likes_count = GREATEST(likes_count - 1, 0)
                    WHERE id = ${targetId}
                `;
                result = await sql`SELECT likes_count FROM comments WHERE id = ${targetId} LIMIT 1`;
            }

            return NextResponse.json({
                liked: false,
                newCount: result[0]?.likes_count || 0,
            });

        } else {
            // Like - add like
            await sql`
                INSERT INTO likes (id, user_id, target_type, target_id)
                VALUES (${uuidv4()}, ${userId}, ${targetType}, ${targetId})
            `;

            let result;
            // Increment count
            if (targetType === 'post') {
                await sql`
                    UPDATE posts
                    SET likes_count = likes_count + 1
                    WHERE id = ${targetId}
                `;
                result = await sql`SELECT likes_count FROM posts WHERE id = ${targetId} LIMIT 1`;
            } else {
                await sql`
                    UPDATE comments
                    SET likes_count = likes_count + 1
                    WHERE id = ${targetId}
                `;
                result = await sql`SELECT likes_count FROM comments WHERE id = ${targetId} LIMIT 1`;
            }

            return NextResponse.json({
                liked: true,
                newCount: result[0]?.likes_count || 0,
            });
        }

    } catch (error) {
        console.error('Toggle like error:', error);
        return NextResponse.json(
            { error: 'Failed to toggle like' },
            { status: 500 }
        );
    }
}
