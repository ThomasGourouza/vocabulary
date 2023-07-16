<?php
// DELETE operation to remove a specific account
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Check if account_id is provided as a query parameter
  if (isset($_GET['account_id'])) {
    $accountId = $_GET['account_id'];

    // Start a database transaction
    $db->exec('BEGIN');

    try {
      $stmt = $db->prepare("SELECT id FROM account WHERE id = :account_id");
      $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
      $result = $stmt->execute();
      $row = $result->fetchArray(SQLITE3_ASSOC);

      if ($row) {
        // Delete the account from the database
        $stmt = $db->prepare("DELETE FROM account WHERE id = :account_id");
        $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
        $stmt->execute();

        // Delete the related settings from the database
        $stmt = $db->prepare("DELETE FROM setting WHERE account_id = :account_id");
        $stmt->bindValue(':account_id', $accountId, SQLITE3_INTEGER);
        $stmt->execute();

        // Commit the transaction
        $db->exec('COMMIT');

        // Return a success message
        http_response_code(200);
        echo json_encode(['message' => 'Account deleted successfully']);
      } else {
        $db->exec('ROLLBACK');
        http_response_code(404);
        echo json_encode(['message' => 'Account not found']);
      }
    } catch (Exception $e) {
      // Rollback the transaction if an error occurred
      $db->exec('ROLLBACK');

      // Return an error message
      http_response_code(500);
      echo json_encode(['message' => 'Failed to delete account']);
    }
  } else {
    // Return an error message if account_id is missing
    http_response_code(400);
    echo json_encode(['message' => 'account_id parameter missing']);
  }
}
