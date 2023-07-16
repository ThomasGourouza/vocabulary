<?php
require_once 'db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

require_once 'account/get.php';
require_once 'account/post.php';
