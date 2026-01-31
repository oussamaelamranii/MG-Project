
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';

interface Post {
    id: number;
    user: string;
    avatar: string;
    time: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    liked: boolean;
}

const MOCK_POSTS: Post[] = [
    {
        id: 1,
        user: 'Coach Marco',
        avatar: 'https://i.pravatar.cc/150?u=macro',
        time: '2h ago',
        content: "Just finished the morning Elite CrossTraining session. The energy was UNREAL today! 🔥 Keep pushing new standards team.",
        image: 'https://picsum.photos/seed/fitness1/600/400',
        likes: 45,
        comments: 12,
        liked: false,
    },
    {
        id: 2,
        user: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        time: '4h ago',
        content: "New PR on my deadlift! 120kg moved like butter. Thanks to the spotters for the hype. 💪",
        likes: 89,
        comments: 24,
        liked: true,
    },
    {
        id: 3,
        user: 'MG Club Official',
        avatar: 'https://i.pravatar.cc/150?u=mgclub',
        time: '6h ago',
        content: "⚠️ Nutrition Workshop this Sunday at 10AM. Learn how to fuel for performance. Sign up at the front desk!",
        likes: 120,
        comments: 5,
        liked: false,
    },
];

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [newPost, setNewPost] = useState('');

    const handleLike = (id: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                    liked: !post.liked
                };
            }
            return post;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const post: Post = {
            id: Date.now(),
            user: 'You',
            avatar: 'https://i.pravatar.cc/150?u=me',
            time: 'Just now',
            content: newPost,
            likes: 0,
            comments: 0,
            liked: false,
        };

        setPosts(prev => [post, ...prev]);
        setNewPost('');
        alert("Post shared with the Tribe!");
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md -mx-6 px-6 py-4 border-b border-white/10">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">The Tribe</h2>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Stronger Together</p>
            </header>

            {/* Create Post */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full border border-white/10" />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share your victory..."
                            className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-medium focus:outline-none py-2"
                        />
                        <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                            <div className="flex gap-4">
                                {/* Icons for attachments could go here */}
                            </div>
                            <button
                                type="submit"
                                disabled={!newPost.trim()}
                                className="bg-royal-blue text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-slideUp">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-white/10" />
                                <div>
                                    <h4 className="font-bold text-sm text-white">{post.user}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{post.time}</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        <div className="px-4 pb-3">
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {post.image && (
                            <img src={post.image} alt="Post content" className="w-full h-64 object-cover" />
                        )}

                        <div className="p-4 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center gap-2 text-xs font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                                    {post.likes}
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                    <MessageCircle size={18} />
                                    {post.comments}
                                </button>
                            </div>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Community;
