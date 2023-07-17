<?php
class Database {
    private $db;

    // Constructor
    public function __construct() {
        $this->db = new SQLite3('database.db');

        // Enable foreign key constraints
        $this->db->exec('PRAGMA foreign_keys = ON;');

        // Create the table if it doesn't exist
        $this->createTable();
    }

    // Create the table
    private function createTable() {
        $query = "
        CREATE TABLE IF NOT EXISTS account (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          login TEXT,
          password TEXT
        );

        CREATE TABLE IF NOT EXISTS setting (
          account_id INTEGER,
          tag TEXT,
          tab TEXT,
          activeItemIndexes BLOB,
          FOREIGN KEY (account_id) REFERENCES account(id)
        );";

        $this->db->exec($query);
    }

    // Get the database connection
    public function getConnection() {
        return $this->db;
    }
}
