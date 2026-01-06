'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import CommentSection from './CommentSection';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
    username: string;
}

interface PostCardProps {
    post: Post;
    currentUserId: string | null;
    delay?: number;
}

export default function PostCard({ post, currentUserId, delay = 0 }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments_count);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        if (!currentUserId) {
            toast.error('Create a post first to interact! 🎃');
            return;
        }

        if (isLiking) return;
        setIsLiking(true);

        try {
            const response = await fetch('/api/community/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    targetType: 'post',
                    targetId: post.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.liked);
                setLikesCount(data.newCount);

                if (data.liked) {
                    toast.success('Liked! ❤️', { duration: 1500 });
                }
            }
        } catch (error) {
            console.error('Failed to like post:', error);
            toast.error('Failed to like post');
        } finally {
            setIsLiking(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -4 }}
            className="content-card group relative overflow-visible flex flex-col transition-all duration-300 border-white/20"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-pumpkin-orange to-orange-600 rounded-2xl flex items-center justify-center font-crazy font-extrabold text-white border-2 border-white/20 text-2xl shadow-lg group-hover:rotate-3 transition-transform">
                        {post.username[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-heading font-black text-gray-900 text-xl tracking-tight">@{post.username}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{formatDate(post.created_at)}</p>
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <p className="text-gray-800 mb-8 whitespace-pre-wrap leading-relaxed text-xl font-bold opacity-90">
                {post.content}
            </p>

            {/* Image */}
            {post.image_url && (
                <motion.div
                    className="mb-8 rounded-3xl overflow-hidden border-2 border-white/10 shadow-hero relative group/img"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image
                        src={post.image_url}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-8 border-t border-white/10 mt-auto">
                <motion.button
                    onClick={handleLike}
                    disabled={!currentUserId || isLiking}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm tracking-tight transition-all border-2 ${isLiked
                        ? 'bg-red-500/10 text-red-600 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        : 'bg-white/40 text-gray-600 border-white/40 hover:bg-white/60'
                        } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Heart className={isLiked ? 'fill-current' : ''} size={18} />
                    <span>{likesCount}</span>
                </motion.button>

                <motion.button
                    onClick={() => setShowComments(!showComments)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm tracking-tight transition-all border-2 ${showComments
                        ? 'bg-teal-accent/10 text-teal-700 border-teal-accent/20 shadow-[0_0_20px_rgba(59,139,139,0.1)]'
                        : 'bg-white/40 text-gray-600 border-white/40 hover:bg-white/60'
                        }`}
                >
                    <MessageCircle size={18} />
                    <span>{commentsCount}</span>
                </motion.button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mt-8 pt-8 border-t border-white/10"
                >
                    <CommentSection
                        postId={post.id}
                        currentUserId={currentUserId}
                        onCommentAdded={() => {
                            setCommentsCount(commentsCount + 1);
                            toast.success('Nice thought! 💬', {
                                style: {
                                    borderRadius: '50px',
                                    background: '#333',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }
                            });
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
