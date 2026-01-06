'use client';

import { useState, useEffect } from 'react';
import { getUserFingerprint, getStoredUsername, setStoredUsername } from '@/lib/user-identity';
import CreatePostModal from '@/components/community/CreatePostModal';
import CompactPostCard from '@/components/community/CompactPostCard';
import PostExpandedModal from '@/components/community/PostExpandedModal';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import VineDecoration from '../components/VineDecoration';
import { Toaster, toast } from 'react-hot-toast';

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    category: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    username: string;
}

const CATEGORIES = ['General', 'Showcase', 'Help', 'Idea', 'Question', 'Bug'];

// Compact Skeleton for the new grid
function CompactSkeleton() {
    return (
        <div className="aspect-square bg-gray-100 rounded-2xl border-2 border-gray-900 animate-pulse flex items-center justify-center text-4xl">
            🎃
        </div>
    );
}

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
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

    const handleUserRegistered = async (newUsername: string): Promise<boolean> => {
        try {
            const fingerprint = await getUserFingerprint();
            const response = await fetch('/api/community/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint, username: newUsername }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserId(data.userId);
                setUsername(data.username);
                setStoredUsername(data.username);
                return true;
            } else {
                toast.error(data.error || 'Failed to register username');
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An unexpected error occurred during registration');
            return false;
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
        <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
            <Navbar />

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

            <main className="flex-1 py-32 px-4 relative overflow-hidden">
                {/* Dynamic hurricane background is handled by InteractiveBackground in layout.tsx */}

                {/* Vine Decorations */}
                <VineDecoration className="top-10 right-10 opacity-40" rotate={120} delay={0.5} />
                <VineDecoration className="bottom-20 left-10 opacity-40" rotate={-45} delay={1} />
                <VineDecoration className="top-1/3 left-5 opacity-30" rotate={90} delay={1.5} />
                <VineDecoration className="bottom-10 right-1/4 opacity-30" rotate={-120} delay={2} />

                <div className="max-w-[1400px] mx-auto relative z-10 px-4">



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
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 bg-pumpkin-orange/10 px-6 py-2 rounded-full mb-6 border-2 border-pumpkin-orange/20 shadow-sm mx-auto">
                            <span className="text-xl">✨</span>
                            <span className="font-heading font-black text-pumpkin-orange tracking-tight uppercase text-sm">Community Lounge</span>
                        </div>
                        <motion.h1
                            className="text-6xl md:text-8xl font-crazy font-extrabold text-gray-900 mb-6 drop-shadow-[2px_2px_0px_#FF8C1A]"
                            animate={{ rotate: [-1, 1, -1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Community Feed
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed"
                        >
                            Share your seeds, connect with growers, and <span className="text-teal-accent underline decoration-wavy">vibe with the patch</span>.
                        </motion.p>
                    </motion.div>

                    {/* Create Post Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className="mb-16 max-w-xl mx-auto"
                    >
                        <button
                            onClick={handleCreateClick}
                            className="btn btn-primary w-full py-6 text-2xl group relative overflow-hidden flex items-center justify-center gap-4"
                        >
                            <span className="text-3xl group-hover:animate-jitter transition-transform">➕</span>
                            <span>Share Something New</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>

                    {loading ? (
                        <div className="space-y-12">
                            {CATEGORIES.slice(0, 2).map((cat) => (
                                <div key={cat}>
                                    <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <CompactSkeleton key={i} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {CATEGORIES.map((cat) => {
                                const catPosts = posts.filter(p => (p.category || 'General') === cat);
                                if (catPosts.length === 0) return null;

                                return (
                                    <motion.div
                                        key={cat}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-3xl font-crazy font-bold text-gray-900 flex items-center gap-3">
                                                <span className="w-3 h-8 bg-pumpkin-orange rounded-full" />
                                                {cat}
                                                <span className="text-sm font-sans text-gray-400 bg-gray-100 px-3 py-1 rounded-full border-2 border-gray-900">
                                                    {catPosts.length}
                                                </span>
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                                            {catPosts.map((post, index) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <CompactPostCard
                                                        post={post}
                                                        currentUserId={userId}
                                                        onClick={() => setSelectedPost(post)}
                                                    />
                                                </motion.div>
                                            ))}
                                            <motion.button
                                                onClick={handleCreateClick}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="aspect-square rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-pumpkin-orange hover:bg-orange-50 transition-all group"
                                            >
                                                <div className="text-2xl group-hover:rotate-12 transition-transform">➕</div>
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-pumpkin-orange">Add to {cat}</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {posts.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 bg-white rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)]"
                                >
                                    <div className="text-8xl mb-6">👀</div>
                                    <p className="text-3xl font-crazy text-gray-900 mb-4">Nothing Here Yet!</p>
                                    <p className="text-xl text-gray-600 font-semibold">Be the brave soul to share something first! 🚀</p>
                                </motion.div>
                            )}
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

            {/* Expanded Post Modal */}
            {selectedPost && (
                <PostExpandedModal
                    post={selectedPost}
                    currentUserId={userId}
                    onClose={() => setSelectedPost(null)}
                />
            )}

            <Footer />
        </div>
    );
}
