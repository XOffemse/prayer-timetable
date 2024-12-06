// Function to save prayer times
function savePrayerTimes() {
    const prayerTimes = {};

    editableCells.forEach(cell => {
        const prayerName = cell.getAttribute('data-prayer-name');
        const newTime = cell.innerText;
        prayerTimes[prayerName] = newTime;
    });
    
    // Send the prayer times to the serverless function
    fetch('/.netlify/functions/savePrayerTimes', {
        method: 'POST',
        body: JSON.stringify(prayerTimes),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
    })
    .catch(error => {
        alert('Error saving prayer times!');
        console.error('Error:', error);
    });
}
