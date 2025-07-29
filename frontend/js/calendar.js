const monthYearLabel = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date();

const subscriptions = {
  // Example format: 'YYYY-MM-DD': 'Plan Name'
  '2025-07-13': 'Netflix',
  '2025-07-22': 'Spotify',
  '2025-08-05': 'Disney+',
};

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get first day of the month
  const firstDay = new Date(year, month, 1).getDay();
  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Update header
  monthYearLabel.textContent = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Clear previous days
  calendarDays.innerHTML = "";

  // Add blank days before first day
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarDays.appendChild(blank);
  }

  // Populate actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;

    if (
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    dayEl.textContent = i;

    if (subscriptions[fullDate]) {
      const tag = document.createElement("div");
      tag.className = "subscription-tag";
      tag.textContent = subscriptions[fullDate];
      dayEl.appendChild(tag);
    }

    calendarDays.appendChild(dayEl);
  }

  document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('click', function() {
      this.classList.add('adding-event-animate');
      setTimeout(() => this.classList.remove('adding-event-animate'), 400);
      // Show add event form, prefill date, etc.
    });
  });
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
