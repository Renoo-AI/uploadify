# DropShare

**DropShare** is a modern, responsive, and completely free file uploader built to convert any file (images, videos, documents, archives) into a direct, shareable URL.

The architecture is simple: an HTML/Tailwind frontend combined with a lightweight, secure PHP backend.

## Features

- **Drag & Drop Uploading**: Easily select files via click or drag-and-drop.
- **Direct Link Generation**: Receive a raw URL (`https://yoursite.com/app/files/random.png`) instantly.
- **Progress Tracking**: Real-time upload progress bars via XHR.
- **Gallery Viewer**: View all uploaded files, sort by newest, with responsive grid layout and previews.
- **Comprehensive Embedding**: Auto-generates HTML tags, Markdown code, and BBCode snippets.
- **Security Built-In**: Randomly renames files, blocks dangerous extensions (PHP, SH, EXE), prevents directory traversal during deletion, and secures the `/files` directory with `.htaccess`.
- **SEO Optimized**: Includes OpenGraph meta tags, Twitter cards, FAQ section, dense content block, and structured Schema data.

## Project Architecture

This application is strictly designed so that **GitHub is only used for version control**, and **Hosting (InfinityFree, 42web, etc.) runs the actual PHP code and stores the files**. Files are stored in the `/app/files/` directory on your server. **Do NOT try to use GitHub Pages** to host this, as GitHub Pages does not support PHP processing or file uploads.

```text
/
├── index.html                 (Redirects traffic automatically to /app/)
└── app/
    ├── index.html             (Main drag-and-drop uploader UI & SEO content)
    ├── gallery.html           (Grid viewer to manage, embed, and delete files)
    ├── upload.php             (Handles incoming files, validates, and renames them)
    ├── list-files.php         (Scans the /files directory and returns JSON metadata)
    ├── delete-file.php        (Safely deletes files, preventing traversal)
    ├── favicon.png
    └── files/                 (Storage directory automatically created by upload.php)
        └── .htaccess          (Prevents script execution for security)
```

## Setup & Hosting Guide (InfinityFree / 42Web)

To run DropShare, you need a hosting provider that supports PHP and file writes (such as InfinityFree, 42web, or any standard cPanel host).

1. **Sign Up / Login**: Register for a free account at [InfinityFree](https://infinityfree.net/) or [42web.io](https://42web.io/).
2. **Create an Account/Domain**: Create a new hosting account and choose a free subdomain (e.g., `mydrop.epizy.com`).
3. **Open File Manager**: Navigate to the Control Panel (cPanel) and open the **Online File Manager**.
4. **Navigate to `htdocs`**: Open the `htdocs` folder (this is the web root). Delete any default `index2.html` files provided by the host.
5. **Upload the Code**:
   - Upload the root `index.html` file into `htdocs/`.
   - Create a folder named `app` inside `htdocs/`.
   - Upload `index.html`, `gallery.html`, `upload.php`, `list-files.php`, `delete-file.php`, and `favicon.png` into the `app/` folder.
6. **Create the `files` Directory**:
   - Inside the `app/` folder, create a new folder named `files`.
   - Ensure the permissions of the `files` folder are set to `0755` or `0777` (usually the default).
   - Upload the `.htaccess` file directly into the `app/files/` folder.
7. **Test the Application**: Go to your chosen domain (e.g., `http://mydrop.epizy.com/`). It should automatically redirect you to the uploader (`/app/`). Try uploading a safe file (like a PNG or JPG).

## Security Notes

- **File Renaming**: `upload.php` strips original filenames and replaces them with an 8-byte cryptographically secure hexadecimal string to prevent collisions and malicious names.
- **Extension Blocking**: Executable server-side scripts are hardcoded to be rejected.
- **.htaccess**: Ensures that even if a malicious script bypasses validation, the Apache server will refuse to execute it if placed in the `/files` directory.

## License

MIT License. Free to use, modify, and distribute.
