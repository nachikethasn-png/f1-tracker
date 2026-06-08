// 1. This runs automatically the second your website opens
document.addEventListener("DOMContentLoaded", () => {
    fetchNextRace(); // New function for race details!
    fetchDriverStandings();
    fetchConstructorStandings();
});

// 2. NEW BRAIN PART: Fetch and display Next Race Details
async function fetchNextRace() {
    try {
        // Secure HTTPS link to get the full season schedule
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
        const data = await response.json();
        
        const race = data.MRData.RaceTable.Races[0];
        const raceName = race.raceName;
        const raceDate = race.date;
        const raceTime = race.time ? race.time.substring(0, 5) : ""; // Gets HH:MM format

        // Put the details straight into your HTML header box
        document.getElementById('next-race-name').innerText = raceName;
        document.getElementById('next-race-date').innerText = `Date: ${raceDate} | Time: ${raceTime} UTC`;

    } catch (error) {
        console.error("Error fetching race schedule:", error);
        document.getElementById('next-race-name').innerText = "Failed to load schedule.";
    }
}

// 3. BRAIN PART A: Fetch and display Driver Points (Fixed HTTPS URL)
async function fetchDriverStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        const data = await response.json();
        
        const standingsList = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const driversContainer = document.getElementById('drivers-list');
        driversContainer.innerHTML = ''; 

        standingsList.forEach(item => {
            const position = item.position;
            const name = `${item.Driver.givenName} ${item.Driver.familyName}`;
            const team = item.Constructors[0].name;
            const points = item.points;

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
        document.getElementById('drivers-list').innerHTML = '<p class="loading">Failed to load driver stats.</p>';
    }
}

// 4. BRAIN PART B: Fetch and display Team Points (Fixed HTTPS URL)
async function fetchConstructorStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        const data = await response.json();
        
        const teamList = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        const teamsContainer = document.getElementById('teams-list');
        teamsContainer.innerHTML = ''; 

        teamList.forEach(item => {
            const position = item.position;
            const teamName = item.Constructor.name;
            const points = item.points;

            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <span><strong>${position}.</strong> ${teamName}</span>
                <strong>${points} PTS</strong>
            `;
            teamsContainer.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching constructor data:", error);
        document.getElementById('teams-list').innerHTML = '<p class="loading">Failed to load team stats.</p>';
    }
}