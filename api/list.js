// api/list.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'Renoo-AI';
  const repo = process.env.GITHUB_REPO || 'uploadify';
  const branch = req.query.branch || process.env.GITHUB_BRANCH || 'main';

  if (!token) return res.status(500).json({ error: 'Server configuration error (missing token)' });

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/files?ref=${branch}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const data = await response.json();

    if (response.status === 404) {
      // The /files directory doesn't exist yet, which is fine
      return res.status(200).json({ success: true, files: [] });
    }

    if (!response.ok) {
      throw new Error(data.message || 'GitHub API error');
    }

    // Map to a simpler structure
    const files = data
      .filter(item => item.type === 'file')
      .map(item => ({
        name: item.name,
        sha: item.sha,
        size: item.size,
        url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/files/${item.name}`,
        download_url: item.download_url,
      }));

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('List Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
