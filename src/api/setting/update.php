<?php
// UPDATE operation to modify an setting
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
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

              // Get data from the request body
              $data = json_decode(file_get_contents("php://input"), true);

              // Extract values from the data
              $activeItemIndexes = $data['activeItemIndexes'];

              // Update the setting in the database
              $stmt = $db->prepare("UPDATE setting SET activeItemIndexes = :activeItemIndexes WHERE account_id = :account_id AND tag = :tag AND tab = :tab");
              $stmt->bindValue(':activeItemIndexes', json_encode($activeItemIndexes), SQLITE3_TEXT);
              $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
              $stmt->bindValue(':tag', $tag, SQLITE3_TEXT);
              $stmt->bindValue(':tab', $tab, SQLITE3_TEXT);
              $stmt->execute();

              // Commit the transaction
              $db->exec('COMMIT');

              // Return a success message
              echo json_encode(['message' => 'Setting updated successfully']);
          } else {
              // Rollback the transaction if the account is not found
              $db->exec('ROLLBACK');

              // Return an error message
              echo json_encode(['message' => 'Account not found']);
          }
      } catch (Exception $e) {
          // Rollback the transaction if an error occurred
          $db->exec('ROLLBACK');

          // Return an error message
          echo json_encode(['message' => 'Failed to update setting']);
      }
  } else {
      // Return an error message if login, password, tag, or tab is missing
      echo json_encode(['message' => 'Login, password, tag, or tab parameter missing']);
  }
}
