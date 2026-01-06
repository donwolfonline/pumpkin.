'use client';

import { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    likes_count: number;
    created_at: string;
    username: string;
}

interface CommentSectionProps {
    postId: string;
    currentUserId: string | null;
    onCommentAdded: () => void;
}

export default function CommentSection({ postId, currentUserId, onCommentAdded }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await fetch(`/api/community/posts/${postId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments || []);
                }
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId || !newComment.trim()) return;

        if (newComment.length > 200) {
            alert('Comment cannot exceed 200 characters');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/community/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    postId,
                    content: newComment.trim(),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([...comments, data.comment]);
                setNewComment('');
                onCommentAdded();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        if (!currentUserId) return;

        try {
            const response = await fetch('/api/community/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    targetType: 'comment',
                    targetId: commentId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(comments.map(c =>
                    c.id === commentId ? { ...c, likes_count: data.newCount } : c
                ));
            }
        } catch (error) {
            console.error('Failed to like comment:', error);
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

    if (loading) {
        return <div className="text-center text-gray-500">Loading comments...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Comment List */}
            {comments.length > 0 && (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white/40 backdrop-blur-md rounded-[24px] p-5 border border-white/40 shadow-sm group/comment transition-all hover:bg-white/60">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-mid to-teal-accent rounded-xl flex items-center justify-center font-crazy font-extrabold text-white text-sm border border-white/20 flex-shrink-0 shadow-md group-hover/comment:rotate-3 transition-transform">
                                    {comment.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-heading font-black text-gray-900 text-sm tracking-tight">@{comment.username}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatDate(comment.created_at)}</p>
                                    </div>
                                    <p className="text-gray-800 text-sm mb-4 leading-relaxed font-bold opacity-80">{comment.content}</p>
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        disabled={!currentUserId}
                                        className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-xs font-black bg-white/40 px-3 py-1.5 rounded-full border border-white/40 hover:bg-white/80"
                                    >
                                        <Heart size={12} className="group-hover/comment:scale-110 transition-transform" />
                                        <span>{comment.likes_count}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Comment Form */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="flex gap-3 relative">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Say something human..."
                        className="flex-1 px-6 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-full font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pumpkin-orange/20 transition-all text-sm shadow-inner"
                        maxLength={200}
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="w-14 h-14 bg-pumpkin-orange text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-pumpkin-orange/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </form>
            ) : (
                <div className="text-center bg-gray-900/5 rounded-3xl py-6 border border-gray-900/5">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
                        Join the patch to comment
                    </p>
                </div>
            )}
        </div>
    );
}
