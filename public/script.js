// Select editable cells and modal elements
const editableCells = document.querySelectorAll('.editable-time');
const modal = document.getElementById('clock-modal');
const timePicker = document.getElementById('time-picker');
const setTimeBtn = document.getElementById('set-time-btn');
const saveBtn = document.getElementById('save-btn');
let currentCell; // Tracks the currently edited cell

// Open the modal
function openModal() {
    modal.style.display = "block"; // Show the modal
    document.body.classList.add('modal-open'); // Prevent background scrolling
}

// Close the modal
function closeModal() {
    modal.style.display = "none"; // Hide the modal
    document.body.classList.remove('modal-open'); // Allow background scrolling
}

// Add click event listeners to editable cells
editableCells.forEach(cell => {
    cell.addEventListener('click', () => {
        currentCell = cell; // Store reference to the clicked cell
        const currentTime = cell.innerText.trim();

        // Extract time and set it in the time picker
        const [hours, minutes] = currentTime.split(' ')[0].split(':');
        timePicker.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        openModal(); // Open the modal
    });
});

// Set the selected time in the clicked cell
setTimeBtn.addEventListener('click', () => {
    const selectedTime = timePicker.value;

    if (selectedTime) {
        let [hours, minutes] = selectedTime.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = (hours % 12) || 12; // Convert to 12-hour format
        currentCell.innerText = `${adjustedHours}:${minutes} ${period}`; // Update cell text
        closeModal(); // Close the modal
    }
});

// Close the modal when clicking outside of it
window.addEventListener('click', event => {
    if (event.target === modal) {
        closeModal();
    }
});

// Example function for setting sunrise and sunset times
function setSunTimes(latitude, longitude) {
    const today = new Date();
    const times = SunCalc.getTimes(today, latitude, longitude);

    const sunrise = times.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const sunset = times.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Set the times in the respective cells
    document.getElementById('sunrise-time').innerText = sunrise;
    document.getElementById('sunset-time').innerText = sunset;
}

// Coordinates for the location (example: Mosque's coordinates)
const latitude = 29.2013;
const longitude = 78.5945;

// Call the function to set sunrise and sunset times
setSunTimes(latitude, longitude);

// Add event listener to prevent keyboard input on the time picker
timePicker.addEventListener('keydown', event => event.preventDefault());
async function savePrayerTimes() {
    const prayerTimes = {};

    document.querySelectorAll('.editable-time').forEach(cell => {
        const prayerName = cell.getAttribute('data-prayer-name');
        const prayerTime = cell.innerText.trim();
        if (prayerName) {
            prayerTimes[prayerName] = prayerTime;
        }
    });

    const response = await fetch('/api/savePrayerTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prayerTimes),
    });

    if (response.ok) {
        alert('Prayer times saved successfully!');
    } else {
        alert('Error saving prayer times!');
    }
}

saveBtn.addEventListener('click', savePrayerTimes);

// Function to load prayer times from the server
async function loadPrayerTimes() {
    try {
        const response = await fetch('/.netlify/functions/getPrayerTimes');
        const data = await response.json();

        editableCells.forEach(cell => {
            const prayerName = cell.getAttribute('data-prayer-name');
            if (data[prayerName]) {
                cell.innerText = data[prayerName];
            }
        });
    } catch (error) {
        console.error('Error loading prayer times:', error);
    }
}

// Load prayer times on page load
document.addEventListener('DOMContentLoaded', loadPrayerTimes);


async function fetchPrayerTimes() {
    const response = await fetch('/api/getPrayerTimes');
    const prayerTimes = await response.json();

    // Populate the table with fetched data
    document.querySelectorAll('.editable-time').forEach(cell => {
        const prayerName = cell.getAttribute('data-prayer-name');
        if (prayerName && prayerTimes[prayerName]) {
            cell.innerText = prayerTimes[prayerName];
        }
    });
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', fetchPrayerTimes);
