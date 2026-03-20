# DropLink

**DropLink** is a modern, serverless image-to-URL and file uploader that securely stores your files directly inside your GitHub repository.

Unlike traditional file hosts, DropLink acts as a frontend interface to your own GitHub repo, providing you with instantaneous, free, permanent direct URLs (`raw.githubusercontent.com`) for images, videos, and documents.

It leverages Vercel Serverless Functions to securely interact with the GitHub API without exposing your personal access tokens to the browser.

## Features

- **Serverless Architecture**: Lightweight frontend utilizing Vercel API routes. No database required.
- **GitHub API Integration**: Directly uploads (`POST`), lists (`GET`), and deletes (`POST`) files using GitHub.
- **Secure Token Handling**: Your GitHub Personal Access Token is securely stored as an Environment Variable in Vercel.
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
5. Generate the token and **copy it**. (You will need this for Vercel).

### 2. Prepare the Repository
1. Create a repository on GitHub (e.g., `uploadify`).
2. Push this DropLink code to your repository.

### 3. Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and click "Add New Project".
2. Import your GitHub repository.
3. Before clicking "Deploy", open the **Environment Variables** section.
4. Add the following required Environment Variables:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token (e.g., `ghp_...`)
   - `GITHUB_OWNER`: Your GitHub username or organization name (e.g., `Renoo-AI`)
   - `GITHUB_REPO`: The name of your repository (e.g., `uploadify`)
   - `GITHUB_BRANCH` (Optional): The branch to upload to. Defaults to `main`.
5. Click **Deploy**.

Once deployed, the frontend will automatically use the Vercel Serverless Functions (`/api/upload`, `/api/list`, `/api/delete`) to manage your files securely!

## Project Structure
- `index.html`: The drag-and-drop uploader UI.
- `gallery.html`: The gallery and file management UI.
- `script.js`: Core frontend logic and API interactions.
- `api/`: Vercel Serverless Functions connecting to GitHub.

## Security Considerations
- Your `GITHUB_TOKEN` is extremely sensitive. By using Vercel Environment Variables, it is never exposed in the browser network tab or source code.
- Files uploaded via DropLink are subject to standard GitHub repository limits. GitHub's API has a hard file size limit; DropLink currently restricts uploads to 20MB to prevent timeout issues on Vercel Serverless Functions and ensure stable base64 conversion.