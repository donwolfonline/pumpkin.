'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';

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

interface CompactPostCardProps {
    post: Post;
    currentUserId: string | null;
    onClick?: () => void;
}

export default function CompactPostCard({ post, onClick }: CompactPostCardProps) {
    // Generate a consistent color based on username
    const colors = ['bg-orange-400', 'bg-teal-400', 'bg-purple-400', 'bg-blue-400', 'bg-pink-400', 'bg-yellow-400'];
    const colorIndex = post.username.length % colors.length;
    const bgColor = colors[colorIndex];

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.05 }}
            className="aspect-square rounded-2xl border-2 md:border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden relative group cursor-pointer bg-white"
        >
            {post.image_url ? (
                <Image
                    src={post.image_url}
                    alt="Post"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
            ) : (
                <div className={`w-full h-full ${bgColor} p-3 flex flex-col justify-center items-center text-center overflow-hidden`}>
                    <p className="text-[10px] md:text-xs font-bold text-white leading-tight line-clamp-4">
                        {post.content}
                    </p>
                </div>
            )}

            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white font-bold truncate">@{post.username}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[8px] text-white font-bold">
                        <Heart size={8} className="fill-red-500 text-red-500" />
                        {post.likes_count}
                    </div>
                    <div className="flex items-center gap-1 text-[8px] text-white font-bold">
                        <MessageCircle size={8} className="text-teal-400" />
                        {post.comments_count}
                    </div>
                </div>
            </div>

            {/* Mini Category Tag (Fixed) */}
            <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-white border border-gray-900 rounded-md text-[8px] font-bold text-gray-900 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {post.category || 'General'}
            </div>
        </motion.div>
    );
}
