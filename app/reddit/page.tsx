'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function RedditInputPage() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            const cleanUsername = username.replace(/^u\//, '').trim();
            router.push(`/reddit/roast?username=${encodeURIComponent(cleanUsername)}`);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1b] text-white p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent opacity-50" />

            <div className="container relative z-10 flex flex-col items-center text-center py-20 px-4">
                <div className="mb-12 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
                        Your Opinions are <br />
                        <span className="text-[#ff4500] drop-shadow-[0_0_15px_rgba(255,69,0,0.4)]">
                            Cooked.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed font-normal">
                        Karma farming? Cringe edits? Echo chambers? <br />
                        Enter your username and let us judge your internet existence.
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff4500] to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Reddit Username (e.g. u/spez)"
                                className="relative w-full bg-[#272729] border border-[#343536] rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-[#ff4500] focus:ring-1 focus:ring-[#ff4500] transition-all placeholder-gray-500 text-white"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="w-full btn-primary bg-[#ff4500] hover:bg-[#ff5414] text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                        >
                            <MessageSquare size={20} /> Roast My Karma
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
