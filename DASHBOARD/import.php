<?php
$mysqli = new mysqli("localhost", "your_user", "your_password", "your_database");
if ($mysqli->connect_errno) {
  die("Failed to connect: " . $mysqli->connect_error);
}

if (isset($_FILES['csv']['tmp_name'])) {
  $file = fopen($_FILES['csv']['tmp_name'], 'r');
  $header = fgetcsv($file); // skip header
  while (($row = fgetcsv($file)) !== FALSE) {
    if (count($row) < 5) continue;
    $stmt = $mysqli->prepare("INSERT INTO residents (name, address, age, sex, contact) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $row[0], $row[1], intval($row[2]), $row[3], $row[4]);
    $stmt->execute();
    $stmt->close();
  }
  fclose($file);
  echo "Import successful!";
} else {
  echo "No file uploaded.";
}
?>