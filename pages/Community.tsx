import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Loader2 } from 'lucide-react';
import { postsApi, ApiPost } from '../utils/api';

interface CommunityProps {
    userId: string;
    userName: string;
}

interface DisplayPost {
    id: string;
    user: string;
    avatar: string;
    time: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    liked: boolean;
}

const MOCK_POSTS: DisplayPost[] = [
    {
        id: '1',
        user: 'Coach Marco',
        avatar: 'https://i.pravatar.cc/150?u=macro',
        time: '2h ago',
        content: "Just finished the morning Elite CrossTraining session. The energy was UNREAL today! 🔥",
        image: 'https://picsum.photos/seed/fitness1/600/400',
        likes: 45,
        comments: 12,
        liked: false,
    },
    {
        id: '2',
        user: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        time: '4h ago',
        content: "New PR on my deadlift! 120kg moved like butter. 💪",
        likes: 89,
        comments: 24,
        liked: true,
    },
    {
        id: '3',
        user: 'MG Club Official',
        avatar: 'https://i.pravatar.cc/150?u=mgclub',
        time: '6h ago',
        content: "⚠️ Nutrition Workshop this Sunday at 10AM. Learn how to fuel for performance!",
        likes: 120,
        comments: 5,
        liked: false,
    },
];

const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
};

const Community: React.FC<CommunityProps> = ({ userId, userName }) => {
    const [posts, setPosts] = useState<DisplayPost[]>([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const apiPosts = await postsApi.getAll(20);
            const displayPosts: DisplayPost[] = apiPosts.map(p => ({
                id: p.id,
                user: p.user?.name || 'Unknown User',
                avatar: p.user?.avatarUrl || `https://i.pravatar.cc/150?u=${p.userId}`,
                time: formatTimeAgo(p.createdAt),
                content: p.content,
                image: p.imageUrl,
                likes: p.likesCount || 0,
                comments: p.commentsCount || 0,
                liked: false,
            }));
            setPosts(displayPosts.length > 0 ? displayPosts : MOCK_POSTS);
        } catch (err) {
            console.warn('API unavailable, using mock data');
            setPosts(MOCK_POSTS);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id: string) => {
        // Optimistic update
        const wasLiked = likedPosts.has(id);

        if (wasLiked) {
            setLikedPosts(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } else {
            setLikedPosts(prev => new Set(prev).add(id));
        }

        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: wasLiked ? post.likes - 1 : post.likes + 1,
                    liked: !wasLiked
                };
            }
            return post;
        }));

        // Call API
        try {
            await postsApi.like(id, userId);
        } catch (err) {
            console.warn('Like API failed, keeping local state');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setSubmitting(true);

        // Optimistic add
        const tempPost: DisplayPost = {
            id: `temp-${Date.now()}`,
            user: userName,
            avatar: `https://i.pravatar.cc/150?u=${userId}`,
            time: 'Just now',
            content: newPost,
            likes: 0,
            comments: 0,
            liked: false,
        };

        setPosts(prev => [tempPost, ...prev]);
        setNewPost('');

        try {
            const createdPost = await postsApi.create(userId, newPost);
            // Replace temp post with real one
            setPosts(prev => prev.map(p =>
                p.id === tempPost.id
                    ? { ...tempPost, id: createdPost.id }
                    : p
            ));
        } catch (err) {
            console.warn('Post creation failed, keeping local');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-md -mx-6 px-6 py-4 border-b border-white/5">
                <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-slideInRight">
                    THE TRIBE
                </h1>
                <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    Stronger Together
                </p>
            </header>

            {/* Create Post */}
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-lg relative overflow-hidden group animate-slideUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <form onSubmit={handleSubmit} className="relative z-10 flex gap-4">
                    <img src={`https://i.pravatar.cc/150?u=${userId}`} className="w-12 h-12 rounded-2xl border border-white/10" alt="You" />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share your victory..."
                            className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-bold focus:outline-none py-3"
                        />
                        <div className="flex justify-end items-center mt-2 border-t border-white/5 pt-3">
                            <button
                                type="submit"
                                disabled={!newPost.trim() || submitting}
                                className="bg-royal-blue hover:bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Feed */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-punchy-yellow" size={32} />
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <article
                            key={post.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden animate-slideUp hover:border-white/10 transition-colors"
                        >
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-0.5 bg-gradient-to-br from-punchy-yellow to-orange-500 rounded-full">
                                        <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border-2 border-black" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{post.user}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{post.time}</p>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="px-5 pb-4">
                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
                            </div>

                            {post.image && (
                                <div className="px-2">
                                    <img src={post.image} alt="Post content" className="w-full h-64 object-cover rounded-2xl" />
                                </div>
                            )}

                            <div className="p-4 flex items-center justify-between mt-2">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${post.liked || likedPosts.has(post.id) ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Heart size={18} fill={post.liked || likedPosts.has(post.id) ? "currentColor" : "none"} />
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all px-3 py-1.5 rounded-lg hover:bg-white/5">
                                        <MessageCircle size={18} />
                                        {post.comments}
                                    </button>
                                </div>
                                <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Community;
