<?php
// filepath: /workspaces/codespaces-blank/get_residents.php
$host = "localhost";
$user = "root";
$pass = "";
$db = "your_db_name";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$barangay = isset($_GET['barangay']) ? $conn->real_escape_string($_GET['barangay']) : '';
$sql = "SELECT * FROM residents WHERE address LIKE '%$barangay%'";
$res = $conn->query($sql);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
$conn->close();
?>