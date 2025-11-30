import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRedditData } from '@/lib/reddit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const data = await getRedditData(username);

        if (!data || !data.about) {
            return NextResponse.json({ error: 'User not found or shadowbanned' }, { status: 404 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const comments = data.history
            .filter((item: any) => item.body)
            .map((item: any) => ({
                subreddit: item.subreddit,
                body: item.body,
                score: item.score,
            }))
            .slice(0, 20);

        const posts = data.history
            .filter((item: any) => item.title)
            .map((item: any) => ({
                subreddit: item.subreddit,
                title: item.title,
                score: item.score,
            }))
            .slice(0, 10);

        const prompt = `
            Roast this Reddit user based on their profile and history. You are a cynical internet troll who hates everyone.
            
            Profile:
            - Username: ${data.about.name}
            - Karma: ${data.about.total_karma}
            - Account Created: ${new Date(data.about.created_utc * 1000).toDateString()}
            
            Recent Activity:
            ${JSON.stringify({ comments, posts })}
            
            Instructions:
            1. Destroy them based on their subreddits. If they post in gaming subs, call them a "sweaty gamer."
            2. If they have high karma, tell them to "touch grass" and "get a job."
            3. If they have low karma, call them a "lurker" or "irrelevant."
            4. Mock their specific comments. Quote them if they said something cringe.
            5. Use terms like "chronically online," "neckbeard," "soyjak," "NPC behavior."
            6. Keep it under 200 words.
        `;

        const result = await model.generateContent(prompt);
        const roast = result.response.text();

        return NextResponse.json({ roast });

    } catch (error: any) {
        console.error('Error generating roast:', error);

        // Handle Rate Limiting (429)
        if (error.message?.includes('429') || error.status === 429) {
            return NextResponse.json({
                error: 'The AI is overheating from roasting so many losers. Try again in a minute.'
            }, { status: 429 });
        }

        return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500 });
    }
}
