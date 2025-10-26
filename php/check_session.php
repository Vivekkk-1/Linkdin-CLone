<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>