import Link from 'next/link';
import { Music, Github, MessageSquare } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#050505] text-white p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />

            <div className="container relative z-10 max-w-5xl mx-auto text-center">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
                    COOKED<span className="text-red-600">.</span>
                </h1>
                <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
                    The ultimate roasting platform. Select your victim and let us humble you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Spotify Card */}
                    <Link href="/spotify" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                                <Music size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Spotify Roast</h2>
                            <p className="text-sm text-gray-400">Judge your terrible music taste and obsession with sad songs.</p>
                        </div>
                    </Link>

                    {/* GitHub Card */}
                    <Link href="/github" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                <Github size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">GitHub Roast</h2>
                            <p className="text-sm text-gray-400">Expose your spaghetti code, empty repos, and lack of commits.</p>
                        </div>
                    </Link>

                    {/* Reddit Card */}
                    <Link href="/reddit" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                                <MessageSquare size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Reddit Roast</h2>
                            <p className="text-sm text-gray-400">Analyze your karma farming and cringe takes in echo chambers.</p>
                        </div>
                    </Link>
                </div>

            </div>

            <div className="mt-12 md:mt-0 md:absolute md:bottom-4 md:right-6 text-xs text-gray-600 font-medium tracking-wide opacity-50 hover:opacity-100 transition-opacity">
                <a href="https://iprajwalsingh7.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    crafted by prajwal
                </a>
            </div>
        </main>
    );
}
