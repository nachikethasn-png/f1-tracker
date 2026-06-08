// 1. This runs automatically the second your website opens in a browser
document.addEventListener("DOMContentLoaded", () => {
    fetchDriverStandings();
    fetchConstructorStandings();
});

// 2. BRAIN PART A: Fetch and display Driver Points
async function fetchDriverStandings() {
    try {
        // Connect to the free live F1 data server
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        const data = await response.json();
        
        // Dig through the data package to grab the specific list of drivers
        const standingsList = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        // Find the HTML box we created for drivers
        const driversContainer = document.getElementById('drivers-list');
        driversContainer.innerHTML = ''; // Clear out the "Fetching..." text

        // Loop through all 20 drivers and add them to your page
        standingsList.forEach(item => {
            const position = item.position;
            const name = `${item.Driver.givenName} ${item.Driver.familyName}`;
            const team = item.Constructors[0].name;
            const points = item.points;

            // Create a custom row for this driver
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <span><strong>${position}.</strong> ${name} <small style="color: #888893;">(${team})</small></span>
                <strong>${points} PTS</strong>
            `;
            driversContainer.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching driver data:", error);
        document.getElementById('drivers-list').innerHTML = '<p class="loading">Failed