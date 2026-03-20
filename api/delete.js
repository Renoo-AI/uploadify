// api/delete.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, sha, branch } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'Renoo-AI';
  const repo = process.env.GITHUB_REPO || 'uploadify';
  const repoBranch = branch || process.env.GITHUB_BRANCH || 'main';

  if (!token) return res.status(500).json({ error: 'Server configuration error (missing token)' });
  if (!filename || !sha) return res.status(400).json({ error: 'Missing filename or SHA' });

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/files/${filename}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete ${filename} via DropLink API`,
        sha: sha,
        branch: repoBranch,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'GitHub API error');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
