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
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-3xl p-6 md:p-8 border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all relative overflow-visible group"
        >
            {/* Decorative corner accent */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-pumpkin-orange rounded-full border-4 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-pumpkin-orange to-orange-600 rounded-full flex items-center justify-center font-bold text-white border-4 border-gray-900 text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        {post.username[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{post.username}</p>
                        <p className="text-sm text-gray-500 font-semibold">{formatDate(post.created_at)}</p>
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-lg font-medium">
                {post.content}
            </p>

            {/* Image */}
            {post.image_url && (
                <motion.div
                    className="mb-4 rounded-2xl overflow-hidden border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image
                        src={post.image_url}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                    />
                </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t-4 border-gray-200">
                <motion.button
                    onClick={handleLike}
                    disabled={!currentUserId || isLiking}
                    whileHover={{ scale: 1.1, rotate: isLiked ? 0 : 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border-2 ${isLiked
                        ? 'bg-red-500 text-white border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-red-50 text-gray-700 border-gray-300 hover:border-red-300'
                        } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Heart className={isLiked ? 'fill-current' : ''} size={20} />
                    <span>{likesCount}</span>
                </motion.button>

                <motion.button
                    onClick={() => setShowComments(!showComments)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border-2 ${showComments
                        ? 'bg-teal-accent text-white border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-teal-50 text-gray-700 border-gray-300 hover:border-teal-300'
                        }`}
                >
                    <MessageCircle size={20} />
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
                    className="mt-6 pt-6 border-t-4 border-gray-200"
                >
                    <CommentSection
                        postId={post.id}
                        currentUserId={currentUserId}
                        onCommentAdded={() => {
                            setCommentsCount(commentsCount + 1);
                            toast.success('Comment added! 💬', { duration: 1500 });
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
