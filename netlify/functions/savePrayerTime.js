const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const prayerTimes = JSON.parse(event.body); // Parse the received data
    const filePath = path.join(__dirname, '../../prayerTimes.json');

    try {
        // Save the new prayer times to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(prayerTimes, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Prayer times updated successfully!' }),
        };
    } catch (error) {
        console.error('Error saving prayer times:', error);
        return {
            statusCode: 500,
            body: 'Error saving prayer times',
        };
    }
};
