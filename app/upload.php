<?php
// Security headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/plain');

$uploadDir = __DIR__ . '/files/';

// Ensure directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Blocked extensions
$blockedExtensions = ['php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'phps', 'cgi', 'pl', 'sh', 'exe', 'jsp', 'asp', 'aspx', 'py', 'bat', 'cmd', 'vbs'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = $_FILES['file']['name'];
        $fileSize = $_FILES['file']['size'];
        $fileType = $_FILES['file']['type'];

        // Get extension
        $fileNameParts = explode('.', $fileName);
        $fileExtension = strtolower(end($fileNameParts));

        if (in_array($fileExtension, $blockedExtensions)) {
            http_response_code(400);
            echo "Error: File type not allowed.";
            exit;
        }

        // Generate random unique name
        $randomString = bin2hex(random_bytes(8));
        $newFileName = $randomString . '.' . $fileExtension;

        // Prevent extremely long filenames
        if (strlen($newFileName) > 200) {
            $newFileName = substr($newFileName, -200);
        }

        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            // Determine protocol
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

            // Handle host
            $host = $_SERVER['HTTP_HOST'];

            // Handle path setup correctly (getting directory path)
            $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
            $scriptDir = ($scriptDir === '/' || $scriptDir === '\\') ? '' : $scriptDir;

            $fileUrl = $protocol . $host . $scriptDir . '/files/' . $newFileName;

            echo $fileUrl;
        } else {
            http_response_code(500);
            echo "Error: Could not move the uploaded file.";
        }
    } else {
        http_response_code(400);
        echo "Error: Upload failed or no file sent. Code: " . (isset($_FILES['file']['error']) ? $_FILES['file']['error'] : 'Unknown');
    }
} else {
    http_response_code(405);
    echo "Error: Method not allowed. Please use POST.";
}
?>