import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Optional, but good for higher rate limits
});

export async function getGithubProfile(username: string) {
    try {
        const { data } = await octokit.request('GET /users/{username}', {
            username,
        });
        return data;
    } catch (error) {
        return null;
    }
}

export async function getGithubRepos(username: string) {
    try {
        const { data } = await octokit.request('GET /users/{username}/repos', {
            username,
            sort: 'updated',
            per_page: 100,
        });
        return data;
    } catch (error) {
        return [];
    }
}
