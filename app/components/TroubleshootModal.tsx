'use client';

import { useState } from 'react';
import { X, HelpCircle, Instagram } from 'lucide-react';

export function TroubleshootModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="mt-8 text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
            >
                <HelpCircle size={16} />
                Trouble connecting?
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#181818] border border-[#282828] rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-yellow-500">⚠️</span> Connection Issues?
                        </h3>

                        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                            <p>
                                Spotify's API currently restricts this app to "Development Mode".
                                This means only manually approved users can log in.
                            </p>

                            <div className="bg-[#282828] p-4 rounded-lg text-xs space-y-2 border border-[#3e3e3e]">
                                <p className="font-semibold text-gray-400 uppercase tracking-wider">Spotify's Ridiculous Requirements for Public Access:</p>
                                <ul className="list-disc pl-4 space-y-1 text-gray-500">
                                    <li>Be a registered company</li>
                                    <li>Have 250,000+ monthly users</li>
                                    <li>Be in "key markets"</li>
                                    <li>Prove commercial viability</li>
                                </ul>
                            </div>

                            <p className="font-medium text-white">
                                Want access? I can add you manually.
                            </p>

                            <a
                                href="https://instagram.com/iprajwalsingh7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-center transition-all transform hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Instagram size={18} />
                                    DM me on Instagram
                                </div>
                                <span className="text-xs font-normal opacity-90 block mt-1">
                                    Send your Name & Email to @iprajwalsingh7
                                </span>
                            </a>

                            <p className="text-xs text-center text-gray-600">
                                *Manual approval might take some time. It's free, just annoying.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
