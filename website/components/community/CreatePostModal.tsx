'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserFingerprint } from '@/lib/user-identity';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
    username: string;
}

interface CreatePostModalProps {
    userId: string | null;
    username: string | null;
    onClose: () => void;
    onPostCreated: (post: Post) => void;
    onUserRegistered: (username: string) => void;
}

export default function CreatePostModal({
    userId,
    username,
    onClose,
    onPostCreated,
    onUserRegistered,
}: CreatePostModalProps) {
    const [step, setStep] = useState(username ? 'post' : 'username');
    const [newUsername, setNewUsername] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newUsername.length < 3 || newUsername.length > 20) {
            setError('Username must be between 3 and 20 characters');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }

        await onUserRegistered(newUsername);
        setStep('post');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Post content cannot be empty');
            return;
        }

        if (content.length > 500) {
            setError('Post cannot exceed 500 characters');
            return;
        }

        setUploading(true);

        try {
            let imageUrl = null;

            // Upload image if present
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('/api/community/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload image');
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.imageUrl;
            }

            // Get fingerprint for rate limiting header
            const fingerprint = await getUserFingerprint();

            // Create post
            const response = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-fingerprint': fingerprint,
                },
                body: JSON.stringify({
                    userId,
                    content: content.trim(),
                    imageUrl,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create post');
            }

            const data = await response.json();
            onPostCreated(data.post);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-crazy font-bold text-gray-900">
                            {step === 'username' ? '👋 Welcome!' : '✨ Create Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border-2 border-red-600 rounded-xl text-red-700 font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Username Step */}
                    {step === 'username' && (
                        <form onSubmit={handleUsernameSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-3">
                                    Choose a username (this will be your identity)
                                </label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="coolpumpkin123"
                                    className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-pumpkin-orange"
                                    maxLength={20}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    3-20 characters, letters, numbers, and underscores only
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-pumpkin-orange text-white font-bold py-3 px-6 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[4px] transition-all"
                            >
                                Continue
                            </button>
                        </form>
                    )}

                    {/* Post Step */}
                    {step === 'post' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-3">
                                    What&apos;s on your mind?
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts, ideas, or a cool Pumpkin project..."
                                    className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl font-medium resize-none focus:outline-none focus:ring-2 focus:ring-pumpkin-orange"
                                    rows={6}
                                    maxLength={500}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2 text-right">
                                    {content.length}/500 characters
                                </p>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-3">
                                    Add an image (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pumpkin-orange hover:bg-orange-50 transition-colors"
                                >
                                    <Upload size={24} className="text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                        {imageFile ? imageFile.name : 'Click to upload image'}
                                    </span>
                                </label>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-4 relative"
                                    >
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={600}
                                            height={400}
                                            className="w-full rounded-xl border-4 border-gray-900 object-cover max-h-64 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                                toast.success('Image removed');
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full border-2 border-gray-900 hover:bg-red-100 hover:border-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-pumpkin-orange text-white font-bold py-3 px-6 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Posting...' : 'Post'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
