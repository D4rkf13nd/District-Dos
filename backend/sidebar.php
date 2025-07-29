<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$username = isset($_SESSION['username']) ? $_SESSION['username'] : '';
?>
<!-- Sidebar -->
<div class="sidebar">
  <div class="sidebar-header">
    <div class="logo d-flex align-items-center gap-2">
      <img src="./frontend/src/img/binky.png" alt="Binky-Logo" style="width: 200px; height: 200px; object-fit: contain;">
      <img src="./frontend/src/img/tayo.png" alt="Tayo-Logo" style="width: 100px; height: 100px; margin-left: -80px;">
    </div>
    <?php if ($username): ?>
      <p>Welcome, <strong><?php echo htmlspecialchars($username); ?></strong></p>
    <?php endif; ?>
  </div>
  <div class="sidebar-menu">
    <h3>Menu</h3>
    <ul>
      <li>
        <a href="#" onclick="navigateTo('dashboard')" class="menu-link active">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <a href="#" onclick="navigateTo('profile')" class="menu-link">
          <i class="fas fa-user"></i>
          <span>Profile</span>
        </a>
      </li>
      <li>
        <a href="#" onclick="navigateTo('calendar')" class="menu-link">
          <i class="fas fa-calendar"></i>
          <span>Calendar</span>
        </a>
      </li>
      <li>
        <a href="#" onclick="navigateTo('setting')" class="menu-link">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
      </li>
    </ul>
  </div>
</div>