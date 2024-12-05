document.addEventListener("DOMContentLoaded", function () {
  // ====== DOM Elements ======
  const calendarDays = document.getElementById("popup_cal_calendar-days");
  const currentMonthDisplay = document.getElementById(
    "popup_cal_current-month"
  );
  const prevMonthBtn = document.getElementById("popup_cal_prev-month");
  const nextMonthBtn = document.getElementById("popup_cal_next-month");
  const selectedDateDisplay = document.querySelectorAll(
    ".popup_cal_selected-date"
  );
  const timeSlots = document.querySelectorAll(".popup_cal_time-slot");
  const timeSlotSelected = document.querySelector(
    ".popup_cal_time-slot-selected"
  );
  const timeSelectedBtns = document.querySelectorAll(
    ".popup_cal_time-slot-selected"
  );
  const timeDisplay = document.querySelector(".time_display");
  const calenderArea = document.querySelector(".popup_cal_right-panel");
  const nextBtns = document.querySelectorAll(".popup_cal_next-button");
  const modalForm = document.querySelector(".popupForm");
  const previousBtn = document.querySelector(".previous_btn_popup");
  const addGuestBtn = document.querySelector(".add_guest");
  const addGuestInput = document.getElementById("add_guestInput");

  // ====== Time Slot Selection ======
  timeSelectedBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      timeSelectedBtns.forEach((button) => button.classList.remove("active"));
      this.classList.add("active");
      timeDisplay.textContent = `${btn.textContent}`;
    });
  });

  // ====== Navigation Buttons ======
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      calenderArea.style.display = "none";
      modalForm.classList.add("active");
      previousBtn.style.display = "flex";
    });
  });

  previousBtn.addEventListener("click", () => {
    calenderArea.style.display = "flex";
    modalForm.classList.remove("active");
    previousBtn.style.display = "none";
  });

  // ====== Add Guest Input ======
  addGuestBtn.addEventListener("click", () => {
    addGuestBtn.style.display = "none";
    addGuestInput.style.display = "flex";
  });

  // ====== Display Current Date ======
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  selectedDateDisplay.forEach((el) => {
    el.textContent = currentDate.toLocaleDateString("en-US", options);
  });

  // ====== Calendar Variables ======
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ====== Render Calendar ======
  function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    currentMonthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
    calendarDays.innerHTML = "";

    // Add empty slots for days before the first of the month
    for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList.add("popup_cal_day", "popup_cal_disabled");
      calendarDays.appendChild(emptyDay);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("popup_cal_day");
      dayElement.textContent = day;

      const currentDate = new Date(currentYear, currentMonth, day);
      const isBeforeToday = currentDate < new Date().setHours(0, 0, 0, 0);
      const isSunday = currentDate.getDay() === 0;

      // Disable past dates and Sundays
      if (isBeforeToday || isSunday) {
        dayElement.classList.add("popup_cal_disabled");
        if (isSunday) {
          dayElement.classList.add("popup_cal_sunday");
        }
      } else {
        dayElement.addEventListener("click", () => {
          document
            .querySelectorAll(".popup_cal_day.popup_cal_selected")
            .forEach((selectedDay) =>
              selectedDay.classList.remove("popup_cal_selected")
            );

          dayElement.classList.add("popup_cal_selected");
          const selectedDate = new Date(currentYear, currentMonth, day);

          selectedDateDisplay.forEach((display) => {
            display.textContent = selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
          });
        });
      }

      // Highlight and select today's date if it's selectable
      if (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear() &&
        !isSunday
      ) {
        dayElement.classList.add("popup_cal_today");
        dayElement.classList.add("popup_cal_selected"); // Add selected class by default

        // Set the selected date display to today's date
        selectedDateDisplay.forEach((display) => {
          display.textContent = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
        });
      }

      calendarDays.appendChild(dayElement);
    }
  }
  // ====== Change Month ======
  prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // ====== Time Slot Selection ======
  timeSlots.forEach((timeSlot) => {
    timeSlot.addEventListener("click", () => {
      document
        .querySelectorAll(".popup_cal_time-slot.popup_cal_selected")
        .forEach((selectedSlot) =>
          selectedSlot.classList.remove("popup_cal_selected")
        );

      timeSlot.classList.add("popup_cal_selected");
      timeSlotSelected.textContent = timeSlot.textContent;
    });
  });

  // Initial render
  renderCalendar();
});

// ====== Guest Email Management ======
const emailInput = document.getElementById("email-input");
const emailContainer = document.getElementById("email-container");
const form = document.querySelector(".right_sticky_form");

emailInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter" || event.key === ",") {
        let email = emailInput.value.trim();
        email = email.replace(/,$/, ""); // Remove trailing commas

        if (email && validateEmail(email)) {
            addEmailChip(email);
            updateEmailInputValue(); // Update the input field value
            emailInput.value = "";
        }
        event.preventDefault();
    }
});

emailContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-btn")) {
        const chip = event.target.parentElement;
        emailContainer.removeChild(chip);
        updateEmailInputValue(); // Update the input field value
    }
});

// Ensure email-input is updated before form submission
form.addEventListener("submit", function () {
    updateEmailInputValue(); // Update input value just before submission
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function addEmailChip(email) {
    const chip = document.createElement("div");
    chip.classList.add("email-chip");
    chip.innerHTML = `
        ${email}
        <span class="close-btn">×</span>
    `;
    emailContainer.insertBefore(chip, emailInput);
}

function updateEmailInputValue() {
    const chips = emailContainer.querySelectorAll(".email-chip");
    const emailList = Array.from(chips).map(chip => chip.textContent.replace("×", "").trim());
    emailInput.value = emailList.join(", "); // Set comma-separated emails in the input field
}
