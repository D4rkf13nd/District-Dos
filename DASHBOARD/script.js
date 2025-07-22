// dashboard.js
let districtChart;
let currentChartType = 'bar';

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

function showAlert(message) {
  alert(message);
}

function renderDistrictChart(labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data = [400, 420, 210, 350, 600, 700, 320]) {
  const ctx = document.getElementById("barChart").getContext("2d");

  if (districtChart) districtChart.destroy();

  // Gradient setup
  const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
  gradient1.addColorStop(0, "#ff0000ff");
  gradient1.addColorStop(1, "#ff5100ff");

  const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
  gradient2.addColorStop(0, "#fff12eff");
  gradient2.addColorStop(1, "#cc8f0bff");

  const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
  gradient3.addColorStop(0, "#6d88e0ff");
  gradient3.addColorStop(1, "#021670ff");

  districtChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "New Customers",
          data: [200, 180, 100, 190, 300, 400, 150],
          backgroundColor: gradient1,
          borderRadius: { topLeft: 8, topRight: 8 },
          stack: 'stack1',
        },
        {
          label: "Returning Customers",
          data: [150, 160, 70, 120, 180, 230, 130],
          backgroundColor: gradient2,
          borderRadius: { topLeft: 8, topRight: 8 },
          stack: 'stack1',
        },
        {
          label: "Guest",
          data: [50, 80, 40, 40, 120, 70, 40],
          backgroundColor: gradient3,
          borderRadius: { topLeft: 8, topRight: 8 },
          stack: 'stack1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          ticks: { beginAtZero: true, stepSize: 200 },
          grid: { drawBorder: false }
        }
      }
    }
  });
}

function toggleDistrictChart() {
  currentChartType = currentChartType === 'bar' ? 'line' : 'bar';
  renderDistrictChart();
}

function handleImportCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n").filter(line => line.trim() !== "");
    if (lines.length < 2) {
      showAlert("CSV file is empty or missing data.");
      return;
    }
    const headers = lines[0].split(",");
    const rows = lines.slice(1);

    const tableBody = document.querySelector(".people table tbody");
    if (!tableBody) {
      showAlert("Table body not found.");
      return;
    }
    tableBody.innerHTML = "";

    const districtCounts = {};
    let totalPopulation = 0;

    rows.forEach(row => {
      const cols = row.split(",");
      if (cols.length < 6) return;
      const [name, address, contact, sex, age, birthday] = cols.map(c => c.trim());

      // Update table
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${name}</td><td>${address}</td><td>${age}</td><td>${sex}</td><td>${contact}</td><td>${birthday}</td>`;
      tableBody.appendChild(tr);

      // Update population
      totalPopulation++;

      // Grouping by address or barangay
      if (address) {
        districtCounts[address] = (districtCounts[address] || 0) + 1;
      }
    });

    // Update chart with real data
    const labels = Object.keys(districtCounts);
    const data = Object.values(districtCounts);
    renderDistrictChart(labels.length ? labels : ["No Data"], data.length ? data : [0]);

    // Update total population display
    const populationCard = document.querySelector(".population-card p1");
    if (populationCard) {
      populationCard.textContent = totalPopulation;
    }

    // Count male/female
    let male = 0, female = 0;
    Array.from(tableBody.children).forEach(row => {
      const sex = row.children[3].textContent.trim().toLowerCase();
      if (sex === "male") male++;
      else if (sex === "female") female++;
    });
    renderPieChart(male, female);

    showAlert("CSV data imported successfully!");
  };

  reader.readAsText(file);
}

function showAddInfoModal() {
  document.getElementById("addInfoModal").style.display = "flex";
}

function closeAddInfoModal() {
  document.getElementById("addInfoModal").style.display = "none";
}

function renderPieChart(male = 0, female = 0) {
  const canvas = document.getElementById("pieChart");
  const ctx = canvas.getContext("2d");

  // Create linear gradients for male and female
  const maleGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  maleGradient.addColorStop(0, "#000000ff");
  maleGradient.addColorStop(1, "#4f5455ff");

  const femaleGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  femaleGradient.addColorStop(0, "#ddd7d7ff");
  femaleGradient.addColorStop(1, "#575152ff");

  if (window.pieChartInstance) window.pieChartInstance.destroy();
  window.pieChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Male", "Female"],
      datasets: [{
        data: [male, female],
        backgroundColor: [maleGradient, femaleGradient],
        borderWidth: 2,
        borderRadius: 20
      }]
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "black",
            font: { weight: "bold" }
          }
        }
      }
    }
  });
}

function loadBarangayData(barangay) {
  fetch(`get_residents.php?barangay=${encodeURIComponent(barangay)}`)
    .then(res => res.json())
    .then(data => {
      const tableBody = document.querySelector(".people table tbody");
      tableBody.innerHTML = "";
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.name}</td><td>${row.address}</td><td>${row.age}</td><td>${row.sex}</td><td>${row.contact}</td><td>${row.birthday}</td>`;
        tableBody.appendChild(tr);
      });
      // Optionally update charts here
    });
}

document.addEventListener("DOMContentLoaded", function () {
  renderDistrictChart();

  // Render pie chart on load
  const tableBody = document.querySelector(".people table tbody");
  let male = 0, female = 0;
  Array.from(tableBody.children).forEach(row => {
    const sex = row.children[3].textContent.trim().toLowerCase();
    if (sex === "male") male++;
    else if (sex === "female") female++;
  });
  renderPieChart(male, female);

  const showMoreBtn = document.getElementById("showMoreChart");
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      const chartContainer = document.querySelector(".chart-container");
      chartContainer.classList.toggle("expanded");
    });
  }

  document.getElementById("barangaySelect").addEventListener("change", function() {
    loadBarangayData(this.value);
  });

  // Add Information button handler
  const addInfoBtn = document.querySelector('.import-controls button');
  if (addInfoBtn) {
    addInfoBtn.onclick = showAddInfoModal;
  }

  // Handle Add Information form submit
  document.getElementById("addInfoForm").onsubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const address = form.address.value.trim();
    const contact = form.contact.value.trim();
    const age = form.age.value.trim();
    const sex = form.sex.value;
    const birthday = form.birthday.value.trim();

    // Validate age: only 2 or 3 digits
    if (!/^\d{2,3}$/.test(age)) {
      showAlert("Age must be 2 or 3 digits (10-999).");
      return;
    }

    // Validate contact: only 8 to 12 digits
    if (!/^\d{8,12}$/.test(contact)) {
      showAlert("Contact must be 8 to 12 digits.");
      return;
    }

    // Add to table
    const tableBody = document.querySelector(".people table tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${name}</td><td>${address}</td><td>${age}</td><td>${sex}</td><td>${contact}</td><td>${birthday}</td>`;
    tableBody.appendChild(tr);

    // Update resident count
    const peopleLength = document.getElementById("peopleLength");
    if (peopleLength) {
      peopleLength.textContent = tableBody.children.length;
    }

    // Update population-card
    const populationCard = document.querySelector(".population-card p1");
    if (populationCard) {
      populationCard.textContent = tableBody.children.length;
    }

    // Count age groups
    let count5 = 0, count21 = 0, count51 = 0;
    Array.from(tableBody.children).forEach(row => {
      const rowAge = parseInt(row.children[2].textContent, 10);
      if (!isNaN(rowAge)) {
        if (rowAge >= 1 && rowAge <= 20) count5++;
        else if (rowAge >= 21 && rowAge <= 50) count21++;
        else if (rowAge >= 51) count51++;
      }
    });

    const total = tableBody.children.length || 1;

    // Update Population-5
    const percentValue = document.getElementById("percentValue");
    const progressFill = document.getElementById("progressFill");
    if (percentValue && progressFill) {
      const percent5 = Math.round((count5 / total) * 100);
      percentValue.textContent = percent5;
      progressFill.style.width = `${percent5}%`;
    }

    // Update Population-21plus
    const percentValue2 = document.getElementById("percentValue2");
    const progressFill2 = document.getElementById("progressFill2");
    if (percentValue2 && progressFill2) {
      const percent21 = Math.round((count21 / total) * 100);
      percentValue2.textContent = percent21;
      progressFill2.style.width = `${percent21}%`;
    }

    // Update Population-51plus
    const percentValue3 = document.getElementById("percentValue3");
    const progressFill3 = document.getElementById("progressFill3");
    if (percentValue3 && progressFill3) {
      const percent51 = Math.round((count51 / total) * 100);
      percentValue3.textContent = percent51;
      progressFill3.style.width = `${percent51}%`;
    }

    // Find the next incoming birthday
    let soonest = null;
    let soonestName = "";
    const today = new Date();
    Array.from(tableBody.children).forEach(row => {
      const bdayStr = row.children[5].textContent;
      if (!bdayStr) return;
      const [year, month, day] = bdayStr.split("-");
      let nextBday = new Date(today.getFullYear(), month - 1, day);
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      if (!soonest || nextBday < soonest) {
        soonest = nextBday;
        soonestName = row.children[0].textContent;
      }
    });

    // Show incoming birthday in birthday container
    const birthdayContainer = document.querySelector(".birthday p");
    if (birthdayContainer) {
      if (soonest) {
        birthdayContainer.textContent = `Next: ${soonestName} (${soonest.toLocaleDateString()})`;
      } else {
        birthdayContainer.textContent = "No data yet";
      }
    }

    // Update Pie Chart after adding info
    let male = 0, female = 0;
    Array.from(tableBody.children).forEach(row => {
      const sex = row.children[3].textContent.trim().toLowerCase();
      if (sex === "male") male++;
      else if (sex === "female") female++;
    });
    renderPieChart(male, female);

    closeAddInfoModal();
    form.reset();
  };
});
