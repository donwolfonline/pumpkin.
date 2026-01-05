'use client';

import { useState, useEffect } from 'react';
import { getUserFingerprint, getStoredUsername, setStoredUsername } from '@/lib/user-identity';
import CreatePostModal from '@/components/community/CreatePostModal';
import PostCard from '@/components/community/PostCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import VineDecoration from '../components/VineDecoration';
import { Toaster } from 'react-hot-toast';

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
    username: string;
}

// Loading Skeleton Component
function PostSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-8 border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
    );
}

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize user
    useEffect(() => {
        async function initUser() {
            try {
                const fingerprint = await getUserFingerprint();
                const storedUsername = getStoredUsername();

                if (storedUsername) {
                    const response = await fetch('/api/community/user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fingerprint }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserId(data.userId);
                        setUsername(data.username);
                    }
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize user:', error);
            }
        }

        initUser();
    }, []);

    // Fetch posts
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/community/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
        const interval = setInterval(fetchPosts, 10000);
        return () => clearInterval(interval);
    }, []);

    const handlePostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
        setShowCreateModal(false);
    };

    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    const handleUserRegistered = async (newUsername: string) => {
        const fingerprint = await getUserFingerprint();
        const response = await fetch('/api/community/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fingerprint, username: newUsername }),
        });

        if (response.ok) {
            const data = await response.json();
            setUserId(data.userId);
            setUsername(data.username);
            setStoredUsername(data.username);
        }
    };

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-6xl"
                >
                    🎃
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    className: 'border-4 border-gray-900 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]',
                    style: {
                        borderRadius: '1rem',
                        background: '#fff',
                        color: '#111',
                    },
                }}
            />

            <main className="min-h-screen bg-[#FFFBF5] py-20 px-4 relative overflow-hidden">
                {/* Dynamic hurricane background is handled by InteractiveBackground in layout.tsx */}


                {/* Vine Decorations */}
                <VineDecoration className="top-10 right-10 opacity-40" rotate={120} delay={0.5} />
                <VineDecoration className="bottom-20 left-10 opacity-40" rotate={-45} delay={1} />
                <VineDecoration className="top-1/3 left-5 opacity-30" rotate={90} delay={1.5} />
                <VineDecoration className="bottom-10 right-1/4 opacity-30" rotate={-120} delay={2} />

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Logo Header - Back to Home */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Image
                                src="/pumpkin-logo.png"
                                alt="Pumpkin"
                                width={140}
                                height={35}
                                className="h-9 w-auto"
                            />
                        </Link>
                    </motion.div>



                    <motion.div
                        animate={{ y: [0, -25, 0], rotate: [5, -5, 5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-40 -right-20 hidden lg:block"
                    >
                        <Image
                            src="/images/mascot_neutral.svg"
                            alt="Curious Pumpkin"
                            width={100}
                            height={100}
                            className="drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                        />
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-center mb-12"
                    >
                        <motion.h1
                            className="text-6xl md:text-7xl font-crazy font-extrabold text-gray-900 mb-4 drop-shadow-[4px_4px_0px_#fff]"
                            animate={{ rotate: [-2, 2, -2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            🎃 Community Feed
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl text-gray-700 font-bold"
                        >
                            Share, Connect, and Vibe! ✨
                        </motion.p>
                    </motion.div>

                    {/* Create Post Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        whileTap={{ scale: 0.98 }}
                        className="mb-8"
                    >
                        <button
                            onClick={handleCreateClick}
                            className="w-full bg-gradient-to-r from-pumpkin-orange to-orange-600 text-white font-bold py-6 px-8 rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <span className="text-3xl">✨</span>
                                <span>Create Your Post</span>
                                <span className="text-3xl">✨</span>
                            </span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>

                    {/* Posts Feed */}
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <PostSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-8xl mb-6"
                            >
                                👀
                            </motion.div>
                            <p className="text-3xl font-crazy text-gray-900 mb-4">
                                Nothing Here Yet!
                            </p>
                            <p className="text-xl text-gray-600 font-semibold">
                                Be the brave soul to share something first! 🚀
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {posts.map((post, index) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    currentUserId={userId}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Post Modal */}
                {showCreateModal && (
                    <CreatePostModal
                        userId={userId}
                        username={username}
                        onClose={() => setShowCreateModal(false)}
                        onPostCreated={handlePostCreated}
                        onUserRegistered={handleUserRegistered}
                    />
                )}
            </main>
        </>
    );
}
