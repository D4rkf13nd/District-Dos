<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'dashboard_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

header('Content-Type: application/json');

$result = $conn->query("SELECT * FROM residents");
$residents = [];
while ($row = $result->fetch_assoc()) {
    $residents[] = $row;
}
echo json_encode($residents);

$conn->close();
?>