'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight } from 'lucide-react';

export default function GithubInputPage() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            router.push(`/github/roast?username=${encodeURIComponent(username)}`);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />

            <div className="container relative z-10 flex flex-col items-center text-center py-20 px-4">
                <div className="mb-12 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
                        Your Code is <br />
                        <span className="text-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            Cooked.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed font-normal">
                        Spaghetti code? Endless forks? Zero commits? <br />
                        Enter your username and let us expose your dev career.
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="GitHub Username"
                                className="relative w-full bg-[#161b22] border border-[#30363d] rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-gray-600 text-white"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="w-full btn-primary bg-white hover:bg-gray-200 text-black font-medium py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                        >
                            <Github size={20} /> Roast My Repo
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
