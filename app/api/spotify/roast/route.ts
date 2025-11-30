import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    let accessToken = request.cookies.get('spotify_access_token')?.value;
    console.log('Cookies received:', request.cookies.getAll());
    console.log('Cookie Access Token:', accessToken);

    if (!accessToken) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            accessToken = authHeader.split(' ')[1];
            console.log('Using Access Token from Header');
        }
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized: Missing access token' }, { status: 401 });
    }

    try {

        const [userProfile, topArtists, topTracks, recentlyPlayed] = await Promise.all([
            axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
            axios.get('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term', { headers: { Authorization: `Bearer ${accessToken}` } }),
            axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term', { headers: { Authorization: `Bearer ${accessToken}` } }),
            axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', { headers: { Authorization: `Bearer ${accessToken}` } }),
        ]);

        const dataSummary = {
            user: userProfile.data.display_name,
            topArtists: topArtists.data.items.map((artist: any) => artist.name).join(', '),
            topTracks: topTracks.data.items.map((track: any) => `${track.name} by ${track.artists[0].name}`).join(', '),
            recent: recentlyPlayed.data.items.map((item: any) => `${item.track.name} by ${item.track.artists[0].name}`).join(', '),
        };


        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite-preview-02-05' });

        const prompt = `
      You are a toxic, elitist music critic. Your job is to completely destroy this user's ego based on their Spotify history.
      
      Here is the user's data:
      Name: ${dataSummary.user}
      Top Artists: ${dataSummary.topArtists}
      Top Tracks: ${dataSummary.topTracks}
      Recently Played: ${dataSummary.recent}

      Instructions:
      1. Be RUTHLESS. Do not hold back. Attack their character based on their music.
      2. If they listen to mainstream pop, call them a "basic NPC."
      3. If they listen to sad music, mock their emotional stability.
      4. If they listen to obscure indie, call them a pretentious hipster.
      5. Use slang like "cooked," "down bad," "mid," "cringe," "touch grass."
      6. Address them directly as "you."
      7. Keep it under 200 words.
      8. FORMATTING: Use short, punchy paragraphs. No walls of text.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ roast: text });

    } catch (error: any) {
        const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error('Error generating roast:', errorMessage);

        // Handle Rate Limiting (429)
        if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || error.status === 429) {
            return NextResponse.json({
                error: 'The AI is overheating from roasting so many losers. Try again in a minute.',
                details: 'Rate limit exceeded'
            }, { status: 429 });
        }

        try {
            const logPath = path.join(process.cwd(), 'server.log');
            fs.appendFileSync(logPath, `${new Date().toISOString()} - Error: ${errorMessage}\nStack: ${error.stack}\n\n`);
        } catch (logError) {
            console.error('Failed to write to log file:', logError);
        }

        return NextResponse.json({ error: 'Failed to generate roast', details: errorMessage }, { status: 500 });
    }
}
