<?php
// setup.php - Run this script once to initialize the database

require_once 'php/db_config.php';

// SQL to create database and tables
$sql = file_get_contents('database_schema.sql');

// Connect to MySQL server (without specifying database)
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Execute the SQL
if ($conn->multi_query($sql)) {
    echo "Database and tables created successfully!";
} else {
    echo "Error creating database and tables: " . $conn->error;
}

$conn->close();
?>