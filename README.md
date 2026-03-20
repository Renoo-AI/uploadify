# DropLink

**DropLink** is a modern, serverless image-to-URL and file uploader that securely stores your files directly inside your GitHub repository using the GitHub REST API.

Unlike traditional file hosts, DropLink acts as a frontend interface to your own GitHub repo, providing you with instantaneous, free, permanent direct URLs (`raw.githubusercontent.com`) for images, videos, and documents.

## Features

- **Serverless Architecture**: 100% Client-side. No backend servers, databases, or PHP required.
- **GitHub API Integration**: Directly uploads (`PUT`), lists (`GET`), and deletes (`DELETE`) files as base64 commits.
- **Modern UI/UX**: Built with Tailwind CSS. Features dark mode, glassmorphism, fluid animations, and a minimal, premium SaaS aesthetic.
- **Comprehensive Gallery**: View all uploaded files in a grid layout, open direct links, or generate HTML/Markdown/BBCode embed snippets.
- **Zero Configuration Hosting**: Can be hosted anywhere (GitHub Pages, Vercel, Netlify, or locally) since the logic runs entirely in the browser.

## Setup Instructions

### 1. Generate a GitHub Personal Access Token
To allow DropLink to upload files to your repository, you need a Personal Access Token (PAT).
1. Go to your GitHub Settings -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Name it "DropLink Uploader".
4. Set expiration to "No expiration" (or whatever you prefer).
5. Under Scopes, select **`repo`** (Full control of private repositories). This is required to push commits via the API.
6. Click **Generate token** and **COPY it immediately**. You won't be able to see it again.

### 2. Configure DropLink
1. Clone or download this project.
2. Rename `config.example.js` to `config.js`.
3. Open `config.js` and input your token and repository details:

```javascript
const GITHUB_CONFIG = {
    // Your personal access token (needs 'repo' scope)
    TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

    // The username or organization that owns the repo
    OWNER: "your-github-username",

    // The name of the repository to store files in
    REPO: "your-repo-name",

    // The branch to push files to (usually 'main' or 'master')
    BRANCH: "main"
};
```

**⚠️ SECURITY WARNING ⚠️**
If you host this project publicly, **anyone** can view the source code and steal your GitHub token, giving them full access to your repositories.
- You should either run this tool **locally** on your own computer.
- OR host it privately (behind authentication).
- We have added `.gitignore` to prevent you from accidentally committing `config.js` to a public repository.

### 3. Usage
Simply open `index.html` in your web browser.
Drag and drop files to upload them. They will be automatically committed to the `files/` directory in your target GitHub repository, and you will receive a direct `raw.githubusercontent.com` URL instantly.

## Architecture & Technical Details
- File size is limited to 20MB in the frontend UI to maintain stability with browser-based Base64 encoding and GitHub API limits.
- GitHub's `raw` URLs are used for direct linking, making them perfect for Discord embeds, forum signatures, or static website assets.

## License
MIT License. Free to use, modify, and distribute.