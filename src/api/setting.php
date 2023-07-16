<?php
require_once 'db.php';

// Create a new instance of the Database class
$database = new Database();
$db = $database->getConnection();

require_once 'setting/get.php';
require_once 'setting/post.php';
require_once 'setting/delete.php';
require_once 'setting/update.php';
