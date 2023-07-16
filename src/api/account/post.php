<?php
// CREATE operation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract values from the data
    $login = $data['login'];
    $password = $data['password'];

    // Start a database transaction
    $db->exec('BEGIN');

    try {
        // Insert the account into the database
        $stmt = $db->prepare("INSERT INTO account (login, password) VALUES (:login, :password)");
        $stmt->bindValue(':login', $login, SQLITE3_TEXT);
        $stmt->bindValue(':password', $password, SQLITE3_TEXT);
        $stmt->execute();

        // Retrieve the generated account ID
        $accountId = $db->lastInsertRowID();

        // Commit the transaction
        $db->exec('COMMIT');

        // Return a success message with the account ID
        echo json_encode(['message' => 'Account created successfully', 'account_id' => $accountId]);
    } catch (Exception $e) {
        // Rollback the transaction if an error occurred
        $db->exec('ROLLBACK');

        // Return an error message
        echo json_encode(['message' => 'Failed to create account']);
    }
}
