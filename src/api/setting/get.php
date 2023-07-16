<?php
// READ operation to get a specific setting
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

              // Retrieve the setting based on the account ID, tag, and tab
              $stmt = $db->prepare("SELECT * FROM setting WHERE account_id = :account_id AND tag = :tag AND tab = :tab");
              $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
              $stmt->bindValue(':tag', $tag, SQLITE3_TEXT);
              $stmt->bindValue(':tab', $tab, SQLITE3_TEXT);
              $result = $stmt->execute();

              // Fetch the setting record
              $setting = $result->fetchArray(SQLITE3_ASSOC);

              if ($setting) {
                  // Return the setting as JSON
                  http_response_code(200);
                  echo json_encode($setting);
              } else {
                  // Return an error message if the setting is not found
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
          echo json_encode(['message' => 'Failed to retrieve setting']);
      }
  } else {
      // Return an error message if login, password, tag, or tab is missing
      http_response_code(400);
      echo json_encode(['message' => 'Login, password, tag, or tab parameter missing']);
  }
}
