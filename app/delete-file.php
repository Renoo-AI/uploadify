<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['filename'])) {
        $filename = $_POST['filename'];

        // Input validation to prevent path traversal
        // Replace all non-alphanumeric characters except dot and hyphen
        $filename = preg_replace('/[^a-zA-Z0-9.\-_]/', '', $filename);

        if (empty($filename) || $filename === '.' || $filename === '..') {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid filename']);
            exit;
        }

        $filepath = __DIR__ . '/files/' . $filename;

        // Ensure the path really resolves to the expected directory
        $realpath = realpath($filepath);
        $expectedDir = realpath(__DIR__ . '/files/');

        if ($realpath && strpos($realpath, $expectedDir) === 0 && is_file($realpath)) {
            if (unlink($realpath)) {
                echo json_encode(['status' => 'success', 'message' => 'File deleted']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete file']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'File not found or access denied']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No filename provided']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>