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
            whileHover={{ y: -8, scale: 1.05 }}
            className="aspect-square rounded-[30px] border border-white/20 bg-white/5 backdrop-blur-xl shadow-card hover:shadow-hero overflow-hidden relative group cursor-pointer"
        >
            {post.image_url ? (
                <div className="w-full h-full relative">
                    <Image
                        src={post.image_url}
                        alt="Post"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
            ) : (
                <div className={`w-full h-full ${bgColor}/20 backdrop-blur-md p-4 flex flex-col justify-center items-center text-center overflow-hidden border-2 border-white/10`}>
                    <p className="text-[10px] md:text-sm font-bold text-gray-800 leading-tight line-clamp-4 px-2">
                        {post.content}
                    </p>
                </div>
            )}

            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-white/10 backdrop-blur-lg border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[10px] text-gray-900 font-heading font-black truncate">@{post.username}</p>
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[8px] text-gray-800 font-bold bg-white/40 px-2 py-0.5 rounded-full border border-white/40">
                        <Heart size={8} className="fill-red-500 text-red-500" />
                        {post.likes_count}
                    </div>
                    <div className="flex items-center gap-1 text-[8px] text-gray-800 font-bold bg-white/40 px-2 py-0.5 rounded-full border border-white/40">
                        <MessageCircle size={8} className="text-teal-600" />
                        {post.comments_count}
                    </div>
                </div>
            </div>

            {/* Mini Category Tag (Premium) */}
            <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/80 backdrop-blur-md border border-white/20 rounded-full text-[7px] font-heading font-black text-pumpkin-orange shadow-sm uppercase tracking-widest group-hover:bg-pumpkin-orange group-hover:text-white transition-all">
                {post.category || 'General'}
            </div>
        </motion.div>
    );
}
