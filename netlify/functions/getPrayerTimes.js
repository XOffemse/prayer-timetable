const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    const filePath = path.join(__dirname, '../../prayerTimes.json');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const prayerTimes = JSON.parse(data);

        return {
            statusCode: 200,
            body: JSON.stringify(prayerTimes),
        };
    } catch (error) {
        console.error('Error reading prayer times:', error);
        return {
            statusCode: 500,
            body: 'Error reading prayer times',
        };
    }
};
