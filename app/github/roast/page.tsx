'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Github, ArrowLeft, RefreshCw, Terminal } from 'lucide-react';
import { FormattedRoast } from '@/app/components/FormattedRoast';

function RoastContent() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const [roast, setRoast] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const fetchRoast = async () => {
            try {
                const res = await fetch('/api/github/roast', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username }),
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch roast');
                }

                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setRoast(data.roast);
            } catch (err) {
                setError('Could not find user or generate roast. Maybe your profile is too boring?');
            } finally {
                setLoading(false);
            }
        };

        fetchRoast();
    }, [username]);

    if (!username) return null;

    return (
        <div className="container max-w-3xl relative z-10 text-center">
            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#238636] border-t-transparent rounded-full animate-spin mb-8"></div>
                    <h2 className="text-2xl font-bold animate-pulse font-mono">Scanning repositories...</h2>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Judging your commit messages...</p>
                </div>
            ) : error ? (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Error 404: Skill Not Found</h2>
                    <p className="text-xl mb-8 text-gray-400">{error}</p>
                    <Link href="/github" className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-colors">
                        Try Another Victim
                    </Link>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-center gap-3 mb-8 text-[#238636]">
                        <Terminal size={24} />
                        <span className="text-sm font-bold tracking-widest uppercase font-mono">Analysis Complete</span>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 md:p-12 shadow-2xl mb-10 text-left relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#238636] to-transparent opacity-50" />
                        <div className="font-mono text-lg md:text-xl leading-relaxed text-gray-300 whitespace-pre-wrap">
                            <span className="text-[#238636] mr-2">$</span>
                            <FormattedRoast text={roast} />
                            <span className="animate-pulse inline-block w-2 h-5 bg-[#238636] ml-1 align-middle"></span>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href="/" className="px-6 py-3 rounded-xl border border-[#30363d] hover:bg-[#161b22] text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <ArrowLeft size={18} /> Home
                        </Link>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-colors flex items-center gap-2">
                            <RefreshCw size={18} /> Roast Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function GithubRoastPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#010409] text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent opacity-30" />
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <RoastContent />
            </Suspense>
        </main>
    );
}
