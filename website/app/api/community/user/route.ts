import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const { fingerprint, username } = await request.json();

        if (!fingerprint) {
            return NextResponse.json(
                { error: 'Fingerprint is required' },
                { status: 400 }
            );
        }

        // Check if user already exists with this fingerprint
        const existingUser = await sql`
            SELECT id, username, created_at 
            FROM users 
            WHERE fingerprint = ${fingerprint}
            LIMIT 1
        `;

        if (existingUser.length > 0) {
            let finalUsername = existingUser[0].username;

            // If a new username is provided and it's different, try to update it
            if (username && username !== finalUsername) {
                // Validate format first
                if (username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)) {
                    // Check availability
                    const contentCheck = await sql`
                        SELECT id FROM users WHERE username = ${username} AND id != ${existingUser[0].id} LIMIT 1
                    `;

                    if (contentCheck.length === 0) {
                        await sql`
                            UPDATE users 
                            SET username = ${username}, last_active = CURRENT_TIMESTAMP 
                            WHERE id = ${existingUser[0].id}
                        `;
                        finalUsername = username;
                    }
                }
            } else {
                await sql`
                    UPDATE users 
                    SET last_active = CURRENT_TIMESTAMP 
                    WHERE id = ${existingUser[0].id}
                `;
            }

            return NextResponse.json({
                userId: existingUser[0].id,
                username: finalUsername,
                isNew: false,
            });
        }

        // New user - username is required
        if (!username || username.length < 3 || username.length > 20) {
            return NextResponse.json(
                { error: 'Username must be between 3 and 20 characters' },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric + underscore only)
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return NextResponse.json(
                { error: 'Username can only contain letters, numbers, and underscores' },
                { status: 400 }
            );
        }

        // Check if username is taken
        const usernameTaken = await sql`
            SELECT id FROM users WHERE username = ${username} LIMIT 1
        `;

        if (usernameTaken.length > 0) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = await sql`
            INSERT INTO users (id, username, fingerprint)
            VALUES (${uuidv4()}, ${username}, ${fingerprint})
            RETURNING id, username, created_at
        `;

        return NextResponse.json({
            userId: newUser[0].id,
            username: newUser[0].username,
            isNew: true,
        }, { status: 201 });

    } catch (error) {
        console.error('User API error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error),
                diagnostics: {
                    hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
                }
            },
            { status: 500 }
        );
    }
}
