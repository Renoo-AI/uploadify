// --- Utility Functions ---

// Convert File to Base64 String (excluding data URL prefix)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data:image/png;base64, prefix required by GitHub API
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

// Generate unique filename to prevent collisions
function generateUniqueFilename(originalName) {
    const ext = originalName.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    return `${timestamp}_${uniqueId}.${ext}`;
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
        document.body.removeChild(textArea);
    }
}

// Minimal Toast System
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const icon = type === 'success' ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-circle text-red-400';
    const bg = 'bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 shadow-2xl';
    const textCol = 'text-slate-800 dark:text-slate-100';

    const toastId = 'toast-' + Date.now();
    const html = `
        <div id="${toastId}" class="transform transition-all duration-300 translate-y-full opacity-0 flex items-center gap-3 px-4 py-3 rounded-xl ${bg}">
            <i class="fa-solid ${icon} text-lg"></i>
            <span class="text-sm font-medium ${textCol}">${message}</span>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', html);
    const el = document.getElementById(toastId);

    // Animate in
    setTimeout(() => {
        el.classList.remove('translate-y-full', 'opacity-0');
    }, 10);

    // Animate out
    setTimeout(() => {
        el.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

// --- Vercel Serverless API Interactions ---

async function uploadFileToGitHub(file, progressCallback) {
    const uniqueName = generateUniqueFilename(file.name);

    try {
        progressCallback(10); // Start Base64 conversion
        const base64Content = await fileToBase64(file);

        progressCallback(50); // Uploading to API

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: uniqueName,
                content: base64Content
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Upload failed');
        }

        progressCallback(100);
        return { success: true, name: uniqueName, url: data.url };

    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: error.message };
    }
}

async function fetchFilesList() {
    try {
        const response = await fetch('/api/list', {
            method: 'GET'
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to fetch files list');
        }

        // Reverse to show newest first
        return data.files.reverse();

    } catch (error) {
        console.error("List Error:", error);
        showToast("Failed to fetch files", 'error');
        return [];
    }
}

async function deleteFileFromGitHub(filename, sha) {
    try {
        const response = await fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: filename,
                sha: sha
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Delete request failed');
        }

        return true;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
}
