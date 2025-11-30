import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGithubProfile, getGithubRepos } from '@/lib/github';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const [profile, repos] = await Promise.all([
            getGithubProfile(username),
            getGithubRepos(username)
        ]);

        if (!profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const repoStats = repos.map((repo: any) => ({
            name: repo.name,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: repo.updated_at,
            description: repo.description
        }));

        const prompt = `
            Roast this GitHub user based on their profile and repositories. Be a toxic senior engineer reviewing a junior's terrible code.
            
            Profile:
            - Username: ${profile.login}
            - Bio: ${profile.bio}
            - Followers: ${profile.followers}
            - Public Repos: ${profile.public_repos}
            - Created At: ${profile.created_at}
            
            Repositories (Top 20):
            ${JSON.stringify(repoStats.slice(0, 20))}
            
            Instructions:
            1. Be BRUTAL. If they have many forks, call them a "copy-paste developer."
            2. If they have many empty repos, ask if they have commitment issues.
            3. If they use HTML/CSS, tell them they aren't a real programmer.
            4. If they use Python/JS, mock their lack of type safety or performance.
            5. Use terms like "spaghetti code," "tech debt," "tutorial hell," "10x engineer (derogatory)."
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
