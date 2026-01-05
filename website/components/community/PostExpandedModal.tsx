'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PostCard from './PostCard';

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

interface PostExpandedModalProps {
    post: Post;
    currentUserId: string | null;
    onClose: () => void;
}

export default function PostExpandedModal({ post, currentUserId, onClose }: PostExpandedModalProps) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                >
                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 z-[110] bg-white text-gray-900 p-2 rounded-full border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 transition-transform"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-2">
                        <PostCard
                            post={post}
                            currentUserId={currentUserId}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
