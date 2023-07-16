<?php
$allowedMethods = ['GET'];
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
  http_response_code(500);
  echo json_encode(['message' => 'Not implemented']);
}

require_once 'db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

// READ operation to get all accounts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Prepare the SQL statement to retrieve all accounts
  $stmt = $db->prepare("SELECT * FROM account");
  $result = $stmt->execute();

  // Prepare an array to store the accounts
  $accounts = [];

  // Loop through the result and add accounts to the array
  while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
      $accounts[] = $row;
  }

  // Return the accounts as JSON
  echo json_encode($accounts);
}
