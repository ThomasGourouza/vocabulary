<?php
// CREATE operation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Check if query parameters exist
  if (isset($_GET['login']) && isset($_GET['password'])) {
    // Get login and password from query parameters
    $login = $_GET['login'];
    $password = $_GET['password'];

    // Get data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract setting values from the data
    $tag = $data['tag'];
    $tab = $data['tab'];
    $activeItemIndexes = $data['activeItemIndexes'];

    // Start a database transaction
    $db->exec('BEGIN');

    try {
      // Search for the matching account based on login and password
      $stmt = $db->prepare("SELECT id FROM account WHERE login = :login AND password = :password");
      $stmt->bindValue(':login', $login, SQLITE3_TEXT);
      $stmt->bindValue(':password', $password, SQLITE3_TEXT);
      $result = $stmt->execute();
      $row = $result->fetchArray(SQLITE3_ASSOC);

      if ($row) {
        $accountId = $row['id'];

        // Insert the setting into the database with the account ID
        $stmt = $db->prepare("INSERT INTO setting (account_id, tag, tab, activeItemIndexes) VALUES (:account_id, :tag, :tab, :activeItemIndexes)");
        $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
        $stmt->bindValue(':tag', $tag, SQLITE3_TEXT);
        $stmt->bindValue(':tab', $tab, SQLITE3_TEXT);
        $stmt->bindValue(':activeItemIndexes', json_encode($activeItemIndexes), SQLITE3_TEXT);
        $stmt->execute();

        // Commit the transaction
        $db->exec('COMMIT');

        // Return a success message
        echo json_encode(['message' => 'Setting created successfully']);
      } else {
        // Rollback the transaction if the account was not found
        $db->exec('ROLLBACK');

        // Return an error message
        echo json_encode(['message' => 'Account not found']);
      }
    } catch (Exception $e) {
      // Rollback the transaction if an error occurred
      $db->exec('ROLLBACK');

      // Return an error message
      echo json_encode(['message' => 'Failed to create setting']);
    }

  } else {
    // Return an error message if query parameters are missing
    echo json_encode(['message' => 'Query parameters missing']);
  }
}
