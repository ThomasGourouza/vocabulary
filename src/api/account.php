<?php
$allowedMethods = ['GET', 'POST', 'DELETE'];
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
  http_response_code(500);
  echo json_encode(['message' => 'Not implemented']);
}

require_once 'db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

require_once 'account/get.php';
require_once 'account/post.php';
require_once 'account/delete.php';
