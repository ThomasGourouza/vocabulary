<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow the following HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
// Allow the following headers
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

$allowedMethods = ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
  http_response_code(500);
  echo json_encode(['message' => 'Not implemented']);
}

require_once 'db/db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

require_once 'setting/get.php';
require_once 'setting/post.php';
require_once 'setting/delete.php';
require_once 'setting/patch.php';
