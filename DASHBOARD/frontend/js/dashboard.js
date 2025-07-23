/**
 * District DOS Dashboard JavaScript
 * Author: [Your Name]
 * Version: 1.0.0
 * Description: Main JavaScript file for the District DOS Dashboard
 */

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

let districtChart = null;
let genderChart = null;
let residentsData = [];
let isChartExpanded = false;
let currentChartType = 'bar';
let isMervilleSitioView = false; // Add this global variable

// Sample data for demonstration
const sampleBarangayData = {
  'Merville': 0,
  'BF Homes': 0,
  'Don Bosco': 0,
  'Marcelo Green': 0,
  'Moonwalk': 0,
  'San Antonio': 0,
  'San Martin de Porres': 0,
  'Sun Valley': 0
};

const sampleGenderData = {
  'Male': 0,
  'Female': 0
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the dashboard when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
});

/**
 * Main initialization function
 */
function initializeDashboard() {
  try {
    renderDistrictChart();
    renderPieChart();
    updateStatistics();
    bindEventListeners();
    loadInitialData();
    
    console.log('Dashboard initialized successfully');
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showNotification('Error initializing dashboard', 'error');
  }
}

/**
 * Bind event listeners to various elements
 */
function bindEventListeners() {
  // Form submission
  const addInfoForm = document.getElementById('addInfoForm');
  if (addInfoForm) {
    addInfoForm.addEventListener('submit', handleFormSubmission);
  }

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Barangay filter
  const barangaySelect = document.getElementById('barangaySelect');
  if (barangaySelect) {
    barangaySelect.addEventListener('change', handleBarangayFilter);
  }

  // File import
  const importInput = document.getElementById('importInput');
  if (importInput) {
    importInput.addEventListener('change', handleImportCSV);
  }
}

// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

/**
 * Navigate between different sections
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateTo(sectionId) {
  try {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Update active menu item
    document.querySelectorAll('.menu-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to clicked menu item
    if (event && event.target) {
      const menuLink = event.target.closest('.menu-link');
      if (menuLink) {
        menuLink.classList.add('active');
      }
    }

    // Trigger section-specific actions
    handleSectionChange(sectionId);
    
  } catch (error) {
    console.error('Navigation error:', error);
    showNotification('Navigation error occurred', 'error');
  }
}

/**
 * Handle section-specific actions when navigating
 * @param {string} sectionId - The ID of the active section
 */
function handleSectionChange(sectionId) {
  switch (sectionId) {
    case 'dashboard':
      // Refresh charts when returning to dashboard
      setTimeout(() => {
        if (districtChart) districtChart.resize();
        if (genderChart) genderChart.resize();
      }, 100);
      break;
    case 'profile':
      loadProfileData();
      break;
    case 'calendar':
      loadCalendarEvents();
      break;
    case 'setting':
      loadSettings();
      break;
    default:
      console.log(`No specific handler for section: ${sectionId}`);
  }
}

// =============================================================================
// CHART FUNCTIONS
// =============================================================================

/**
 * Render the main district population bar chart
 */
function renderDistrictChart(customLabels, customData) {
  try {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    const chartCtx = ctx.getContext('2d');
    if (districtChart) districtChart.destroy();

    let barangayNames, populationData;
    if (customLabels && customData) {
      barangayNames = customLabels;
      populationData = customData;
    } else {
      // Calculate barangay counts from residentsData
      const barangays = [
        'Merville', 'BF Homes', 'Don Bosco', 'Marcelo Green',
        'Moonwalk', 'San Antonio', 'San Martin de Porres', 'Sun Valley'
      ];
      barangayNames = barangays;
      populationData = barangays.map(barangay =>
        residentsData.filter(res =>
          res.address && res.address.toLowerCase().includes(barangay.toLowerCase())
        ).length
      );
    }

    const backgroundColors = [
      '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
      '#96CEB4', '#FCEA2B', '#FF9F43', '#6C5CE7',
      '#A29BFE', '#00B894', '#E17055', '#6D214F'
    ];

    districtChart = new Chart(chartCtx, {
      type: currentChartType,
      data: {
        labels: barangayNames,
        datasets: [{
          label: 'Population',
          data: populationData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color + '80'),
          borderWidth: 2,
          borderRadius: currentChartType === 'bar' ? 8 : 0,
          hoverBackgroundColor: backgroundColors.map(color => color + 'CC'),
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#FFD700',
            bodyColor: '#FFFFFF',
            borderColor: '#FFD700',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `Population: ${context.parsed.y !== undefined ? context.parsed.y : context.parsed}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            ticks: {
              color: '#6C757D',
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6C757D',
              maxRotation: 45
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        onClick: handleBarChartClick // Attach click handler
      }
    });

    console.log('District chart rendered successfully');
  } catch (error) {
    console.error('Error rendering district chart:', error);
    showNotification('Error loading population chart', 'error');
  }
}

/**
 * Render the gender distribution pie chart
 */
function renderPieChart() {
  try {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    const chartCtx = ctx.getContext('2d');
    if (genderChart) genderChart.destroy();

    // Calculate gender counts from residentsData
    let male = 0, female = 0;
    residentsData.forEach(resident => {
      if (resident.sex && resident.sex.toLowerCase() === 'male') male++;
      else if (resident.sex && resident.sex.toLowerCase() === 'female') female++;
    });

    const genderLabels = ['Male', 'Female'];
    const genderValues = [male, female];

    genderChart = new Chart(chartCtx, {
      type: 'doughnut',
      data: {
        labels: genderLabels,
        datasets: [{
          data: genderValues,
          backgroundColor: ['#4ECDC4', '#FF6B6B'],
          borderColor: ['#3CBCCF', '#E63946'],
          borderWidth: 3,
          hoverBackgroundColor: ['#7FDDDD', '#FF9999'],
          hoverBorderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              color: '#6C757D',
              font: {
                size: 14,
                weight: '600'
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#FFD700',
            bodyColor: '#FFFFFF',
            borderColor: '#FFD700',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.parsed;
                const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%',
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });

    console.log('Gender chart rendered successfully');
  } catch (error) {
    console.error('Error rendering gender chart:', error);
    showNotification('Error loading gender chart', 'error');
  }
}

/**
 * Toggle between different chart types
 */
function toggleDistrictChart() {
  try {
    currentChartType = currentChartType === 'bar' ? 'line' : 'bar';
    renderDistrictChart();
    
    const toggleButton = document.querySelector('.chart-toggle-btn');
    if (toggleButton) {
      const icon = toggleButton.querySelector('i');
      icon.className = currentChartType === 'bar' ? 'fas fa-chart-line' : 'fas fa-chart-bar';
    }
    
    showNotification(`Chart switched to ${currentChartType} view`, 'success');
  } catch (error) {
    console.error('Error toggling chart:', error);
    showNotification('Error switching chart type', 'error');
  }
}

/**
 * Toggle chart container height
 */
function toggleChartHeight() {
  try {
    const chartContainer = document.querySelector('.chart-container');
    const toggleButton = document.getElementById('showMoreChart');
    
    if (!chartContainer || !toggleButton) {
      console.error('Chart container or toggle button not found');
      return;
    }

    isChartExpanded = !isChartExpanded;
    
    if (isChartExpanded) {
      chartContainer.style.height = '500px';
      toggleButton.textContent = 'Show Less';
      toggleButton.classList.replace('btn-outline-secondary', 'btn-outline-primary');
    } else {
      chartContainer.style.height = '300px';
      toggleButton.textContent = 'Show More';
      toggleButton.classList.replace('btn-outline-primary', 'btn-outline-secondary');
    }

    // Resize chart after height change
    setTimeout(() => {
      if (districtChart) {
        districtChart.resize();
      }
    }, 300);

    showNotification(`Chart ${isChartExpanded ? 'expanded' : 'collapsed'}`, 'info');
  } catch (error) {
    console.error('Error toggling chart height:', error);
    showNotification('Error adjusting chart size', 'error');
  }
}

// =============================================================================
// DATA MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Update dashboard statistics
 */
function updateStatistics() {
  try {
    // Calculate total population
    const totalPopulation = residentsData.length;

    // Update total population
    const totalPopElement = document.getElementById('totalPopulation');
    if (totalPopElement) {
      animateNumber(totalPopElement, 0, totalPopulation, 1500);
    }

    // Update people length
    const peopleLengthElement = document.getElementById('peopleLength');
    if (peopleLengthElement) {
      peopleLengthElement.textContent = totalPopulation.toLocaleString();
    }

    // Calculate age group percentages
    updateAgeGroupStatistics();

    // Update charts
    renderDistrictChart();
    renderPieChart();

    console.log('Statistics updated successfully');
  } catch (error) {
    console.error('Error updating statistics:', error);
    showNotification('Error updating statistics', 'error');
  }
}

function updateAgeGroupStatistics() {
  const total = residentsData.length || 1; // avoid division by zero

  // Age group counts
  let group1 = 0; // 1-20
  let group2 = 0; // 21-50
  let group3 = 0; // 51+

  residentsData.forEach(resident => {
    const age = parseInt(resident.age, 10);
    if (!isNaN(age)) {
      if (age >= 1 && age <= 20) group1++;
      else if (age >= 21 && age <= 50) group2++;
      else if (age >= 51) group3++;
    }
  });

  // Calculate percentages
  const percent1 = Math.round((group1 / total) * 100);
  const percent2 = Math.round((group2 / total) * 100);
  const percent3 = Math.round((group3 / total) * 100);

  // Update UI
  animateNumber(document.getElementById('percentValue'), 0, percent1, 1000, '%');
  animateNumber(document.getElementById('percentValue2'), 0, percent2, 1000, '%');
  animateNumber(document.getElementById('percentValue3'), 0, percent3, 1000, '%');

  document.getElementById('progressFill').style.width = `${percent1}%`;
  document.getElementById('progressFill2').style.width = `${percent2}%`;
  document.getElementById('progressFill3').style.width = `${percent3}%`;
}

/**
 * Load initial demo data
 */
function loadInitialData() {
  try {
    // Sample residents data
    residentsData = [
      {
        name: "Juan Dela Cruz",
        address: "123 Merville St.",
        age: 35,
        sex: "Male",
        contact: "09123456789",
        birthday: "1989-03-15"
      },
      {
        name: "Maria Santos",
        address: "456 BF Homes Ave.",
        age: 28,
        sex: "Female",
        contact: "09987654321",
        birthday: "1995-07-22"
      },
      {
        name: "Pedro Reyes",
        address: "789 Don Bosco St.",
        age: 42,
        sex: "Male",
        contact: "09111222333",
        birthday: "1981-11-08"
      }
    ];

    renderResidentsTable(residentsData);
    console.log('Initial data loaded successfully');
  } catch (error) {
    console.error('Error loading initial data:', error);
    showNotification('Error loading sample data', 'error');
  }
}

/**
 * Render residents table
 * @param {Array} data - Array of resident objects
 */
function renderResidentsTable(data) {
  try {
    const tableBody = document.getElementById('residentsTable');
    if (!tableBody) {
      console.error('Residents table body not found');
      return;
    }

    if (!data || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            <i class="fas fa-users fa-2x mb-2"></i><br>
            No residents data available
          </td>
        </tr>
      `;
      return;
    }

    const tableRows = data.map((resident, index) => {
      const formattedBirthday = resident.birthday ? 
        new Date(resident.birthday).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) : 'N/A';

      return `
        <tr data-index="${index}" class="table-row-animate">
          <td class="fw-semibold">${resident.name}</td>
          <td>${resident.address}</td>
          <td><span class="badge bg-info">${resident.age}</span></td>
          <td>
            <span class="badge ${resident.sex === 'Male' ? 'bg-primary' : 'bg-danger'}">
              <i class="fas fa-${resident.sex === 'Male' ? 'mars' : 'venus'} me-1"></i>
              ${resident.sex}
            </span>
          </td>
          <td>
            <a href="tel:${resident.contact}" class="text-decoration-none">
              <i class="fas fa-phone me-1"></i>${resident.contact}
            </a>
          </td>
          <td>
            <small class="text-muted">
              <i class="fas fa-birthday-cake me-1"></i>${formattedBirthday}
            </small>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = tableRows;

    // Animate table rows
    setTimeout(() => {
      const rows = tableBody.querySelectorAll('.table-row-animate');
      rows.forEach((row, index) => {
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 100);

    console.log(`Residents table rendered with ${data.length} entries`);
  } catch (error) {
    console.error('Error rendering residents table:', error);
    showNotification('Error loading residents table', 'error');
  }
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handle form submission for adding new resident
 * @param {Event} event - Form submit event
 */
function handleFormSubmission(event) {
  event.preventDefault();
  
  try {
    const formData = new FormData(event.target);
    const newResident = {
      name: formData.get('name'),
      address: formData.get('address'),
      age: parseInt(formData.get('age')),
      sex: formData.get('sex'),
      contact: formData.get('contact'),
      birthday: formData.get('birthday')
    };

    // Validate required fields
    if (!newResident.name || !newResident.address || !newResident.age || !newResident.sex || !newResident.contact || !newResident.birthday) {
      showNotification('Please fill in all required fields', 'warning');
      return;
    }

    // Add to residents data
    residentsData.push(newResident);
    
    // Update table and statistics
    renderResidentsTable(residentsData);
    updateStatistics();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addInfoModal'));
    if (modal) {
      modal.hide();
    }

    // Reset form
    event.target.reset();
    
    showNotification('Resident added successfully!', 'success');
    console.log('New resident added:', newResident);
  } catch (error) {
    console.error('Error submitting form:', error);
    showNotification('Error adding resident. Please try again.', 'error');
  }
}

/**
 * Handle search functionality
 * @param {Event} event - Input event
 */
function handleSearch(event) {
  try {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      renderResidentsTable(residentsData);
      return;
    }

    const filteredData = residentsData.filter(resident => 
      resident.name.toLowerCase().includes(searchTerm) ||
      resident.address.toLowerCase().includes(searchTerm) ||
      resident.contact.includes(searchTerm)
    );

    renderResidentsTable(filteredData);
    
    // Update search results count
    const resultsCount = filteredData.length;
    const peopleLengthElement = document.getElementById('peopleLength');
    if (peopleLengthElement) {
      peopleLengthElement.textContent = resultsCount;
    }

    console.log(`Search results: ${resultsCount} residents found`);
  } catch (error) {
    console.error('Error handling search:', error);
    showNotification('Error performing search', 'error');
  }
}

/**
 * Handle barangay filter change
 * @param {Event} event - Change event
 */
function handleBarangayFilter(event) {
  try {
    const selectedBarangay = event.target.value;
    
    if (!selectedBarangay) {
      renderResidentsTable(residentsData);
      document.getElementById('peopleLength').textContent = residentsData.length;
      return;
    }

    const filteredData = residentsData.filter(resident => 
      resident.address.toLowerCase().includes(selectedBarangay.toLowerCase())
    );

    renderResidentsTable(filteredData);
    document.getElementById('peopleLength').textContent = filteredData.length;
    
    showNotification(`Filtered by ${selectedBarangay}: ${filteredData.length} residents`, 'info');
    console.log(`Barangay filter applied: ${selectedBarangay}`);
  } catch (error) {
    console.error('Error handling barangay filter:', error);
    showNotification('Error applying filter', 'error');
  }
}

/**
 * Handle CSV file import
 * @param {Event} event - File input change event
 */
function handleImportCSV(event) {
  try {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      showNotification('Please select a valid CSV file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        if (lines.length < 2) {
          showNotification('CSV file appears to be empty or invalid', 'warning');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const expectedHeaders = ['name', 'address', 'age', 'sex', 'contact', 'birthday'];
        const headerMap = {};
        expectedHeaders.forEach(field => {
          const index = headers.findIndex(h => h.toLowerCase().includes(field));
          if (index !== -1) headerMap[field] = index;
        });

        const importedData = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const resident = {
            name: headerMap.name !== undefined ? values[headerMap.name] : '',
            address: headerMap.address !== undefined ? values[headerMap.address] : '',
            age: headerMap.age !== undefined ? parseInt(values[headerMap.age]) : 0,
            sex: headerMap.sex !== undefined ? values[headerMap.sex] : '',
            contact: headerMap.contact !== undefined ? values[headerMap.contact] : '',
            birthday: headerMap.birthday !== undefined ? values[headerMap.birthday] : ''
          };
          // Validate required fields (allow age 0)
          if (resident.name && resident.address && resident.sex && !isNaN(resident.age)) {
            importedData.push(resident);
          }
        }

        if (importedData.length === 0) {
          showNotification('No valid data found in CSV file', 'warning');
          return;
        }

        residentsData.push(...importedData);
        renderResidentsTable(residentsData);
        updateStatistics();
        showNotification(`Successfully imported ${importedData.length} residents`, 'success');
        event.target.value = '';
      } catch (parseError) {
        console.error('Error parsing CSV:', parseError);
        showNotification('Error parsing CSV file. Please check the format.', 'error');
      }
    };

    reader.onerror = function() {
      showNotification('Error reading CSV file', 'error');
    };

    reader.readAsText(file);
  } catch (error) {
    console.error('Error handling CSV import:', error);
    showNotification('Error importing CSV file', 'error');
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Animate number counting effect
 * @param {HTMLElement} element - Target element
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Optional suffix (e.g., '%')
 */
function animateNumber(element, start, end, duration, suffix = '') {
  if (!element) return;
  
  const startTime = performance.now();
  const difference = end - start;
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (difference * easeOut));
    
    element.innerHTML = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border-radius: 8px;
  `;
  
  const iconMap = {
    'success': 'fas fa-check-circle',
    'error': 'fas fa-exclamation-triangle',
    'warning': 'fas fa-exclamation-circle',
    'info': 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="${iconMap[type]} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

/**
 * Format date string
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Calculate age from birthday
 * @param {string} birthday - Birthday string
 * @returns {number} Age in years
 */
function calculateAge(birthday) {
  try {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 0;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
function isValidPhone(phone) {
  const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// =============================================================================
// SECTION-SPECIFIC FUNCTIONS
// =============================================================================

/**
 * Load profile data (placeholder)
 */
function loadProfileData() {
  console.log('Loading profile data...');
  // TODO: Implement profile data loading
}

/**
 * Load calendar events (placeholder)
 */
function loadCalendarEvents() {
  console.log('Loading calendar events...');
  // TODO: Implement calendar functionality
}

/**
 * Load settings (placeholder)
 */
function loadSettings() {
  console.log('Loading settings...');
  // TODO: Implement settings functionality
}

// =============================================================================
// DATA EXPORT FUNCTIONS
// =============================================================================

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 * @param {string} filename - Export filename
 */
function exportToCSV(data, filename = 'residents_data.csv') {
  try {
    if (!data || data.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(resident => 
      Object.values(resident).map(value => `"${value}"`).join(',')
    ).join('\n');
    
    const csvContent = headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    window.URL.revokeObjectURL(url);
    showNotification('Data exported successfully', 'success');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    showNotification('Error exporting data', 'error');
  }
}

/**
 * Print current data
 */
function printData() {
  try {
    window.print();
  } catch (error) {
    console.error('Error printing:', error);
    showNotification('Error printing data', 'error');
  }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  showNotification('An unexpected error occurred', 'error');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  showNotification('An error occurred while processing data', 'error');
});

// =============================================================================
// RESPONSIVE DESIGN HELPERS
// =============================================================================

/**
 * Handle responsive design changes
 */
function handleResponsiveChanges() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (window.innerWidth <= 992) {
    // Mobile view
    if (sidebar) {
      sidebar.classList.add('mobile-hidden');
    }
  } else {
    // Desktop view
    if (sidebar) {
      sidebar.classList.remove('mobile-hidden');
    }
  }
  
  // Resize charts if they exist
  setTimeout(() => {
    if (districtChart) districtChart.resize();
    if (genderChart) genderChart.resize();
  }, 300);
}

// Listen for window resize
window.addEventListener('resize', debounce(handleResponsiveChanges, 250));

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =============================================================================
// INITIALIZATION CHECK
// =============================================================================

console.log('District DOS Dashboard JavaScript loaded successfully');
console.log('Version: 1.0.0');
console.log('Features: Navigation, Charts, Data Management, CSV Import/Export');

// Export functions for global access (if needed)
window.DashboardApp = {
  navigateTo,
  toggleDistrictChart,
  toggleChartHeight,
  handleImportCSV,
  exportToCSV,
  printData,
  showNotification
};

// --- Add this function to handle chart bar clicks ---
function handleBarChartClick(evt) {
  if (!districtChart) return;
  const points = districtChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  if (points.length) {
    const firstPoint = points[0];
    const label = districtChart.data.labels[firstPoint.index];

    // If Merville is clicked and not already in sitio view, show sitios
    if (!isMervilleSitioView && label === "Merville") {
      showMervilleSitioInChart();
      return;
    }
    // If already in sitio view, go back to barangay view
    if (isMervilleSitioView) {
      isMervilleSitioView = false;
      renderDistrictChart();
      return;
    }
  }
}

// --- Add this function to show Merville Sitio in the chart ---
function showMervilleSitioInChart() {
  isMervilleSitioView = true;
  const sitios = [
    "Sitio Cubic Side (Purok)",
    "Sitio Tuyu‑an (Purok)",
    "Sitio Malaya (Purok)",
    "Sitio Katwell (Purok)",
    "Sitio L. Marquez Compound (Purok)",
    "Sitio Sta. Agueda Compound (Purok)",
    "Sitio Wella (Purok)",
    "Sitio Manggahan I (Purok)",
    "Sitio Manggahan II (Purok)",
    "Sitio All‑Top (Purok)",
    "Sitio Nomads (Purok)",
    "Sitio Dulo Barcelona (Purok)"
  ];
  // Count residents per sitio (case-insensitive, must include "merville" and sitio name)
  const sitioCounts = sitios.map(sitio =>
    residentsData.filter(res =>
      res.address &&
      res.address.toLowerCase().includes("merville") &&
      res.address.toLowerCase().includes(sitio.toLowerCase().split(" (")[0])
    ).length
  );
  renderDistrictChart(sitios, sitioCounts);
  showNotification('Showing Merville Sitio breakdown. Click any sitio bar to return.', 'info');
}

// --- Make sure to call renderDistrictChart() with no arguments on initial load and after toggling back ---