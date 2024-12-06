const { get } = require("http");
const { writeFileSync, readFileSync } = require("fs");

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod === "POST") {
            // Get data from the request body
            const body = JSON.parse(event.body);

            // Save the prayer times to a file (or a database)
            writeFileSync("prayerTimes.json", JSON.stringify(body));

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Prayer times saved successfully!" }),
            };
        }

        // If GET request, return saved prayer times
        const savedTimes = readFileSync("prayerTimes.json", "utf8");

        return {
            statusCode: 200,
            body: savedTimes,
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error saving prayer times!" }),
        };
    }
};
