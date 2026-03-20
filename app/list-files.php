<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$uploadDir = __DIR__ . '/files/';
$filesList = [];

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);

    foreach ($files as $file) {
        // Ignore hidden files and .htaccess
        if ($file === '.' || $file === '..' || substr($file, 0, 1) === '.') {
            continue;
        }

        $filePath = $uploadDir . $file;

        if (is_file($filePath)) {
            // Get file properties
            $size = filesize($filePath);
            $timestamp = filemtime($filePath);
            $date = date("Y-m-d H:i:s", $timestamp);

            // Format size for readability
            $formattedSize = formatBytes($size);

            $filesList[] = [
                'name' => $file,
                'size' => $formattedSize,
                'timestamp' => $timestamp,
                'date' => $date
            ];
        }
    }
}

// Sort the list based on timestamp descending (newest first)
usort($filesList, function ($a, $b) {
    return $b['timestamp'] <=> $a['timestamp'];
});

echo json_encode(['status' => 'success', 'data' => $filesList]);

// Helper function
function formatBytes($bytes, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');

    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);

    $bytes /= pow(1024, $pow);

    return round($bytes, $precision) . ' ' . $units[$pow];
}
?>