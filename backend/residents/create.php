<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // Change if you set a password
$db   = 'dashboard_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$name     = $_POST['name'] ?? '';
$contact  = $_POST['contact'] ?? '';
$address  = $_POST['address'] ?? '';
$age      = $_POST['age'] ?? '';
$sex      = $_POST['sex'] ?? '';
$birthday = $_POST['birthday'] ?? '';

$stmt = $conn->prepare("INSERT INTO residents (name, contact, address, age, sex, birthday) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiss", $name, $contact, $address, $age, $sex, $birthday);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>