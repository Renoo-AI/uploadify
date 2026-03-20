// --- Configuration System (Client-Side) ---

// Default settings fallback
const DEFAULT_SETTINGS = {
    token: '',
    owner: 'Renoo-AI',
    repo: 'uploadify',
    branch: 'main'
};

// Retrieve settings from localStorage
function getSettings() {
    const saved = localStorage.getItem('droplink_settings');
    if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
    return DEFAULT_SETTINGS;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('droplink_settings', JSON.stringify(settings));
    window.location.reload(); // Reload to apply new API base URLs
}

// Check if basic setup is complete
function isSetupComplete() {
    const s = getSettings();
    return s.token && s.owner && s.repo;
}

const config = getSettings();
const API_BASE = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/files/`;
const RAW_BASE = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/files/`;

// --- Utility Functions ---

function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
}

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

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
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

// --- GitHub Direct API Interactions ---

async function uploadFileToGitHub(file, progressCallback) {
    if (!isSetupComplete()) {
        document.getElementById('settingsModal').classList.add('show');
        return { success: false, error: "Missing Configuration" };
    }

    const uniqueName = generateUniqueFilename(file.name);
    const url = `${API_BASE}${uniqueName}`;
    const rawUrl = `${RAW_BASE}${uniqueName}`;

    try {
        progressCallback(10); // Start Base64 conversion
        const base64Content = await fileToBase64(file);

        progressCallback(50); // Uploading directly to GitHub API

        const payload = {
            message: `Upload ${uniqueName} via DropLink UI`,
            content: base64Content,
            branch: config.branch
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Upload failed');
        }

        progressCallback(100);
        return { success: true, name: uniqueName, url: rawUrl };

    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: error.message };
    }
}

async function fetchFilesList() {
    if (!isSetupComplete()) {
        document.getElementById('settingsModal').classList.add('show');
        return [];
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.status === 404) {
            // Folder doesn't exist yet, return empty array
            return [];
        }

        if (response.status === 401) {
             throw new Error("Invalid GitHub Token. Please check settings.");
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        // Filter out non-files and format
        return data.filter(item => item.type === 'file').map(item => ({
            name: item.name,
            size: item.size,
            sha: item.sha,
            url: `${RAW_BASE}${item.name}`,
            download_url: item.download_url
        })).reverse(); // Naive reverse to show newest first

    } catch (error) {
        console.error("List Error:", error);
        showToast(error.message, 'error');
        if (error.message.includes("Token")) {
             document.getElementById('settingsModal').classList.add('show');
        }
        return [];
    }
}

async function deleteFileFromGitHub(filename, sha) {
    if (!isSetupComplete()) return false;

    try {
        const payload = {
            message: `Delete ${filename}`,
            sha: sha,
            branch: config.branch
        };

        const response = await fetch(`${API_BASE}${filename}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Delete request failed');
        }

        return true;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
}
