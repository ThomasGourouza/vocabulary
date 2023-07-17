<?php
// READ operation to get a specific account
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Check if login and password are provided as query parameters
  if (isset($_GET['login']) && isset($_GET['password'])) {
      $login = $_GET['login'];
      $password = $_GET['password'];

      // Prepare the SQL statement to retrieve the account
      $stmt = $db->prepare("SELECT * FROM account WHERE login = :login AND password = :password");
      $stmt->bindValue(':login', $login, SQLITE3_TEXT);
      $stmt->bindValue(':password', $password, SQLITE3_TEXT);
      $result = $stmt->execute();

      // Fetch the account record
      $account = $result->fetchArray(SQLITE3_ASSOC);

      if ($account) {
          // Return the account as JSON
          http_response_code(200);
          echo json_encode($account);
      } else {
          // Return an error message if the account is not found
          http_response_code(404);
          echo json_encode(['message' => 'Account not found']);
      }
  } else {
      // Return an error message if login or password is missing
      http_response_code(400);
      echo json_encode(['message' => 'Login or password parameter missing']);
  }
}
