export async function getRedditData(username: string) {
    try {
        // Fetch user profile (about)
        const aboutRes = await fetch(`https://www.reddit.com/user/${username}/about.json`, {
            headers: {
                'User-Agent': 'CookedRoastApp/1.0',
            },
        });

        if (!aboutRes.ok) return null;
        const aboutData = await aboutRes.json();

        // Fetch user history (comments/posts)
        const historyRes = await fetch(`https://www.reddit.com/user/${username}.json?limit=50`, {
            headers: {
                'User-Agent': 'CookedRoastApp/1.0',
            },
        });

        if (!historyRes.ok) return null;
        const historyData = await historyRes.json();

        return {
            about: aboutData.data,
            history: historyData.data.children.map((child: any) => child.data),
        };
    } catch (error) {
        return null;
    }
}
