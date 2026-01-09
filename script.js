function goToBooking() {
    window.location.href = "booking.html";
}

function goToAppointments() {
    window.location.href = "appointments.html";
}

const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM"
];

let selectedSlot = null;

// Load slots when date changes
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
        dateInput.addEventListener("change", loadSlots);
    }
});

function loadSlots() {
    const date = document.getElementById("appointmentDate").value;
    const slotDiv = document.getElementById("slots");
    slotDiv.innerHTML = "";
    selectedSlot = null;

    if (!date) return;

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    timeSlots.forEach(slot => {
        const btn = document.createElement("button");
        btn.textContent = slot;

        const booked = appointments.some(a => a.date === date && a.time === slot);
        if (booked) {
            btn.classList.add("disabled");
            btn.disabled = true;
        } else {
            btn.onclick = () => selectSlot(btn, slot);
        }

        slotDiv.appendChild(btn);
    });
}

function selectSlot(button, slot) {
    document.querySelectorAll(".slot-container button")
        .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");
    selectedSlot = slot;
}

function bookAppointment() {
    const date = document.getElementById("appointmentDate").value;
    const name = document.getElementById("name").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const message = document.getElementById("message");

    if (!date || !selectedSlot || !name || !contact) {
        message.style.color = "red";
        message.textContent = "Please fill all details and select a slot.";
        return;
    }

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        id: Date.now(),
        name,
        contact,
        date,
        time: selectedSlot
    });

    localStorage.setItem("appointments", JSON.stringify(appointments));

    window.location.href = "confirmation.html";
}

// Load confirmation details
document.addEventListener("DOMContentLoaded", () => {
    const detailsDiv = document.getElementById("details");

    if (detailsDiv) {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        if (appointments.length === 0) {
            detailsDiv.innerHTML = "<p>No appointment found.</p>";
            return;
        }

        const last = appointments[appointments.length - 1];

        detailsDiv.innerHTML = `
            <p><strong>Name:</strong> ${last.name}</p>
            <p><strong>Contact:</strong> ${last.contact}</p>
            <p><strong>Date:</strong> ${last.date}</p>
            <p><strong>Time:</strong> ${last.time}</p>
        `;
    }
});

function goHome() {
    window.location.href = "index.html";
}

// Load all appointments
document.addEventListener("DOMContentLoaded", () => {
    const listDiv = document.getElementById("appointmentList");
    if (!listDiv) return;

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    if (appointments.length === 0) {
        listDiv.innerHTML = "<p>No appointments booked.</p>";
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    appointments.forEach(app => {
        const card = document.createElement("div");
        const isPast = app.date < today;

        card.className = `appointment-card ${isPast ? "past" : "upcoming"}`;

        card.innerHTML = `
            <p><strong>Name:</strong> ${app.name}</p>
            <p><strong>Contact:</strong> ${app.contact}</p>
            <p><strong>Date:</strong> ${app.date}</p>
            <p><strong>Time:</strong> ${app.time}</p>
            <p><strong>Status:</strong> ${isPast ? "Past" : "Upcoming"}</p>
            ${!isPast ? `<button class="cancel-btn" onclick="cancelAppointment(${app.id})">
    Cancel
</button>` : ""}
        `;

        listDiv.appendChild(card);
    });
});

function cancelAppointment(id) {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments = appointments.filter(app => app.id !== id);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    location.reload();
}
