<?php
// DELETE operation to remove a specific setting
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Check if login, password, tag, and tab are provided as query parameters
  if (isset($_GET['login']) && isset($_GET['password']) && isset($_GET['tag']) && isset($_GET['tab'])) {
    $login = $_GET['login'];
    $password = $_GET['password'];
    $tag = $_GET['tag'];
    $tab = $_GET['tab'];

    // Start a database transaction
    $db->exec('BEGIN');

    try {
      // Retrieve the account ID based on the provided login and password
      $stmt = $db->prepare("SELECT id FROM account WHERE login = :login AND password = :password");
      $stmt->bindValue(':login', $login, SQLITE3_TEXT);
      $stmt->bindValue(':password', $password, SQLITE3_TEXT);
      $result = $stmt->execute();
      $row = $result->fetchArray(SQLITE3_ASSOC);

      if ($row) {
        $accountId = $row['id'];

        $stmt = $db->prepare("SELECT account_id FROM setting WHERE account_id = :account_id AND tag = :tag AND tab = :tab");
        $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
        $stmt->bindValue(':tag', $tag, SQLITE3_TEXT);
        $stmt->bindValue(':tab', $tab, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row2 = $result->fetchArray(SQLITE3_ASSOC);
        if ($row2) {
          // Delete the setting from the database
          $stmt = $db->prepare("DELETE FROM setting WHERE account_id = :account_id AND tag = :tag AND tab = :tab");
          $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
          $stmt->bindValue(':tag', $tag, SQLITE3_TEXT);
          $stmt->bindValue(':tab', $tab, SQLITE3_TEXT);
          $stmt->execute();

          // Commit the transaction
          $db->exec('COMMIT');

          // Return a success message
          http_response_code(200);
          echo json_encode(['message' => 'Setting deleted successfully']);
        } else {
          $db->exec('ROLLBACK');
          http_response_code(404);
          echo json_encode(['message' => 'Setting not found']);
        }
      } else {
        // Rollback the transaction if the account is not found
        $db->exec('ROLLBACK');

        // Return an error message
        http_response_code(404);
        echo json_encode(['message' => 'Account not found']);
      }
    } catch (Exception $e) {
      // Rollback the transaction if an error occurred
      $db->exec('ROLLBACK');

      // Return an error message
      http_response_code(500);
      echo json_encode(['message' => 'Failed to delete setting']);
    }
  } else {
    // Return an error message if login or password is missing
    http_response_code(400);
    echo json_encode(['message' => 'Login or password parameter missing']);
  }
}
