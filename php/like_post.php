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
    
    $post_id = $data['post_id'] ?? '';
    $user_id = $_SESSION['user_id'];
    
    // Validate input
    if (empty($post_id)) {
        echo json_encode(['success' => false, 'message' => 'Post ID is required']);
        exit;
    }
    
    // Connect to database
    $conn = getDBConnection();
    
    // Check if user already liked this post
    $stmt = $conn->prepare("SELECT id FROM likes WHERE user_id = ? AND post_id = ?");
    $stmt->bind_param("ii", $user_id, $post_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User already liked this post, so remove the like (unlike)
        $stmt = $conn->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
        $stmt->bind_param("ii", $user_id, $post_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Post unliked successfully', 'liked' => false]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to unlike post']);
        }
    } else {
        // User hasn't liked this post yet, so add the like
        $stmt = $conn->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $post_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Post liked successfully', 'liked' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to like post']);
        }
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>