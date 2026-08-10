export type LeetCodeStats = {
  status: string;
  message: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
};

export type CodeforcesUser = {
  handle: string;
  email: string;
  vkId: string;
  openId: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  organization: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
};

export type CodeforcesStats = {
  status: string;
  result: CodeforcesUser[];
};

export type GitHubUserStats = {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GitHubRepoStats = {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string;
};

// Next.js fetch with revalidation (cache for 1 hour to avoid rate limits)
const fetchOptions: RequestInit = { next: { revalidate: 3600 } };

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data || !data.data.matchedUser) return null;

    const submissions = data.data.matchedUser.submitStats.acSubmissionNum;
    let totalSolved = 0, easySolved = 0, mediumSolved = 0, hardSolved = 0;

    submissions.forEach((sub: any) => {
      if (sub.difficulty === 'All') totalSolved = sub.count;
      if (sub.difficulty === 'Easy') easySolved = sub.count;
      if (sub.difficulty === 'Medium') mediumSolved = sub.count;
      if (sub.difficulty === 'Hard') hardSolved = sub.count;
    });

    return {
      status: 'success',
      message: 'Retrieved',
      totalSolved,
      totalQuestions: 0,
      easySolved,
      totalEasy: 0,
      mediumSolved,
      totalMedium: 0,
      hardSolved,
      totalHard: 0,
      acceptanceRate: 0,
      ranking: 0,
      contributionPoints: 0,
      reputation: 0,
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
}

export async function getCodeforcesStats(handle: string): Promise<CodeforcesUser | null> {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, fetchOptions);
    if (!res.ok) return null;
    const data: CodeforcesStats = await res.json();
    if (data.status === 'OK' && data.result.length > 0) {
      return data.result[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching Codeforces stats:', error);
    return null;
  }
}

export async function getGitHubUserStats(username: string): Promise<GitHubUserStats | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      ...fetchOptions,
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching GitHub user stats:', error);
    return null;
  }
}

export async function getGitHubRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
  try {
    if (!repoUrl || repoUrl === '#') return null;
    // Extract owner/repo from URL
    // e.g., https://github.com/utkarsh-1912/portfolio2
    const urlParts = new URL(repoUrl).pathname.split('/').filter(Boolean);
    if (urlParts.length < 2) return null;
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      ...fetchOptions,
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching GitHub repo stats:', error);
    return null;
  }
}
