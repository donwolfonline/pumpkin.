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
        <div className="space-y-4">
            {/* Comment List */}
            {comments.length > 0 && (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-teal-accent rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-gray-900 flex-shrink-0">
                                    {comment.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-gray-900 text-sm">{comment.username}</p>
                                        <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                                    </div>
                                    <p className="text-gray-800 text-sm mb-2 leading-relaxed">{comment.content}</p>
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        disabled={!currentUserId}
                                        className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors text-sm"
                                    >
                                        <Heart size={14} />
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
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 border-2 border-gray-900 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-pumpkin-orange"
                        maxLength={200}
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="px-4 py-2 bg-pumpkin-orange text-white font-bold rounded-xl border-2 border-gray-900 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
            ) : (
                <p className="text-center text-gray-500 text-sm py-4">
                    Create a post to comment
                </p>
            )}
        </div>
    );
}
