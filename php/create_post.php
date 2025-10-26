<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $content = $data['content'] ?? '';
    $user_id = $_SESSION['user_id'];
    
    // Validate input
    if (empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Post content is required']);
        exit;
    }
    
    // Connect to database
    $conn = getDBConnection();
    
    // Insert new post
    $stmt = $conn->prepare("INSERT INTO posts (user_id, content) VALUES (?, ?)");
    $stmt->bind_param("is", $user_id, $content);
    
    if ($stmt->execute()) {
        $post_id = $stmt->insert_id;
        echo json_encode([
            'success' => true, 
            'message' => 'Post created successfully',
            'post' => [
                'id' => $post_id,
                'user_id' => $user_id,
                'content' => $content,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create post']);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>