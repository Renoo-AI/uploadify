// api/upload.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, content, branch } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'Renoo-AI';
  const repo = process.env.GITHUB_REPO || 'uploadify';
  const repoBranch = branch || process.env.GITHUB_BRANCH || 'main';

  if (!token) return res.status(500).json({ error: 'Server configuration error (missing token)' });
  if (!filename || !content) return res.status(400).json({ error: 'Missing filename or content' });

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/files/${filename}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${filename} via DropLink API`,
        content: content,
        branch: repoBranch,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'GitHub API error');
    }

    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${repoBranch}/files/${filename}`;

    return res.status(200).json({
      success: true,
      url: rawUrl,
      sha: data.content.sha,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
