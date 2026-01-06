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
    category: string;
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
    onUserRegistered: (username: string) => Promise<boolean>;
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
    const [category, setCategory] = useState('General');

    const categories = ['General', 'Showcase', 'Help', 'Idea', 'Question', 'Bug'];

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

        const success = await onUserRegistered(newUsername);
        if (success) {
            setStep('post');
            setError('');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return;
        }

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

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('/api/community/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json().catch(() => ({}));
                    const detailMsg = errorData.details ? ` (${errorData.details})` : '';
                    const diagMsg = errorData.diagnostics ? ` [Token: ${errorData.diagnostics.hasBlobToken}]` : '';
                    throw new Error(`${errorData.error || 'Failed to upload image'}${detailMsg}${diagMsg}`);
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.imageUrl;
            }

            const fingerprint = await getUserFingerprint();

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
                    category,
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

            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[30px] p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border-4 border-gray-900 shadow-[8px_8px_0px_#111] relative"
                >
                    {/* Background Pattern - Optional subtle noise could go here, but keeping it clean for now */}


                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-crazy font-extrabold text-gray-900">
                            {step === 'username' ? '👋 Welcome!' : '✨ Create Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all border-2 border-transparent hover:border-gray-200"
                        >
                            <X size={24} className="text-gray-900" />
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-5 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-red-700 font-bold text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {step === 'username' && (
                        <form onSubmit={handleUsernameSubmit} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-gray-900 font-heading font-black text-sm uppercase tracking-widest mb-4">
                                    Identity Profile
                                </label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="Enter username..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pumpkin-orange focus:ring-4 focus:ring-pumpkin-orange/10 transition-all"
                                    maxLength={20}
                                    required
                                />
                                <p className="text-xs text-gray-400 font-bold mt-3 ml-4">
                                    3-20 characters: letters, numbers, and underscores only.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-5 text-xl relative group overflow-hidden"
                            >
                                <span className="relative z-10">Plant Your Roots</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </form>
                    )}

                    {step === 'post' && (
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-gray-900 font-heading font-black text-sm uppercase tracking-widest mb-4">
                                    Your Thoughts
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your seeds with the world..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-pumpkin-orange focus:ring-4 focus:ring-pumpkin-orange/10 transition-all"
                                    rows={4}
                                    maxLength={500}
                                    required
                                />
                                <p className="text-[10px] text-gray-400 font-black mt-2 text-right uppercase tracking-widest">
                                    {content.length} / 500
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-900 font-heading font-black text-sm uppercase tracking-widest mb-4">
                                    Select Category
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${category === cat
                                                ? 'bg-pumpkin-orange text-white border-pumpkin-orange shadow-md'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-900 font-heading font-black text-sm uppercase tracking-widest mb-4">
                                    Visual Media
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                {!imagePreview ? (
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-pumpkin-orange hover:bg-orange-50/50 transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload size={32} className="text-pumpkin-orange" />
                                        </div>
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                            Click to Upload
                                        </span>
                                    </label>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative group/preview"
                                    >
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={600}
                                            height={400}
                                            className="w-full rounded-[30px] border-2 border-white/20 object-cover max-h-64 shadow-hero"
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
                                            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-colors"
                                        >
                                            <X size={20} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className={`btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 relative group overflow-hidden ${uploading ? 'opacity-50' : ''}`}
                            >
                                <span className="relative z-10">{uploading ? 'Processing...' : 'Share with Community'}</span>
                                {!uploading && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
