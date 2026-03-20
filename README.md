# DropLink

**DropLink** is a modern, serverless image-to-URL and file uploader that securely stores your files directly inside your GitHub repository.

Unlike traditional file hosts, DropLink acts as a frontend interface to your own GitHub repo, providing you with instantaneous, free, permanent direct URLs (`raw.githubusercontent.com`) for images, videos, and documents.

It leverages a **Zero-Config Client-Side** approach. You host the HTML/JS anywhere, and you enter your GitHub Token securely in the browser's local storage.

## Features

- **100% Client-Side Architecture**: No backend servers or Vercel API routes needed. Host it literally anywhere (GitHub Pages, Netlify, Vercel).
- **GitHub API Integration**: Directly uploads (`PUT`), lists (`GET`), and deletes (`DELETE`) files using GitHub.
- **Secure Token Handling**: Your GitHub Personal Access Token is saved only in your browser's local storage. It is **never** committed to the codebase or sent to any third-party server.
- **Modern UI/UX**: Built with Tailwind CSS. Features dark mode, glassmorphism, fluid animations, and a minimal, premium SaaS aesthetic.
- **Comprehensive Gallery**: View all uploaded files in a grid layout, open direct links, or generate HTML/Markdown/BBCode embed snippets.

## Setup Instructions

### 1. Generate a GitHub Personal Access Token
To allow DropLink to upload files to your repository, you need a Personal Access Token (PAT).
1. Go to your GitHub Settings -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Give it a descriptive name (e.g., "DropLink Uploads").
4. Under **Scopes**, check **repo** (Full control of private repositories).
   *Note: If you plan to only use a public repository, you might only need the `public_repo` scope.*
5. Generate the token and **copy it**.

### 2. Deploy the Frontend
You can host this repository anywhere that serves static HTML files. No configuration files are required.
1. Push this code to GitHub.
2. Enable **GitHub Pages** (Settings > Pages > Source: main branch).
3. OR deploy it to **Vercel** as a static site.

### 3. Connect DropLink
1. Open your deployed DropLink website URL.
2. A **Settings Modal** will automatically appear.
3. Enter your:
   - **GitHub Token**: (The one you copied in step 1)
   - **Username**: Your GitHub username (e.g., `Renoo-AI`)
   - **Repository Name**: The name of your repository (e.g., `uploadify`)
4. Click **Save**.

You are now ready to upload files securely straight to your GitHub repository!

## Security Considerations
- Your `GITHUB_TOKEN` is extremely sensitive. By saving it in `localStorage`, it remains safely in your browser and is only sent directly to `api.github.com`.
- Files uploaded via DropLink are subject to standard GitHub repository limits. DropLink currently restricts uploads to 20MB to ensure stable base64 conversion in the browser.