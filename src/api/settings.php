<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow the following HTTP methods
header("Access-Control-Allow-Methods: GET");
// Allow the following headers
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

$allowedMethods = ['GET'];
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
  http_response_code(500);
  echo json_encode(['message' => 'Not implemented']);
}

require_once 'db/db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

// READ operation to get all settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Prepare the SQL statement to retrieve all settings
  $stmt = $db->prepare("SELECT setting.*, account.login, account.password
  FROM setting
  JOIN account ON setting.account_id = account.id
  ");
  $result = $stmt->execute();

  // Prepare an array to store the settings
  $settings = [];

  // Loop through the result and add settings to the array
  while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $settings[] = $row;
  }

  // Return the settings as JSON
  echo json_encode($settings);
}
