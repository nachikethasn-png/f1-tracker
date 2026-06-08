// 1. This runs automatically the second your website opens
document.addEventListener("DOMContentLoaded", async () => {
    // We load them one by one to ensure the connection stays stable
    await fetchNextRace();
    await fetchDriverStandings();
    await fetchConstructorStandings();
});

// 2. Fetch and display Next Race Details
async function fetchNextRace() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        
        const race = data.MRData.RaceTable.Races[0];
        if (race) {
            const raceName = race.raceName;
            const raceDate = race.date;
            const raceTime = race.time ? race.time.substring(0, 5) : ""; 

            document.getElementById('next-race-name').innerText = raceName;
            document.getElementById('next-race-date').innerText = `Date: ${raceDate} | Time: ${raceTime} UTC`;
        }
    } catch (error) {
        console.error("Error fetching race schedule:", error);
        document.getElementById('next-race-name').innerText = "Schedule temporarily unavailable";
    }
}

// 3. Fetch and display Driver Points
async function fetchDriverStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        if (!response.ok) throw new Error("Network error");
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
        document.getElementById('drivers-list').innerHTML = '<p class="loading">Data feed busy. Try refreshing!</p>';
    }
}

// 4. Fetch and display Team Points
async function fetchConstructorStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        if (!response.ok) throw new Error("Network error");
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
        document.getElementById('teams-list').innerHTML = '<p class="loading">Data feed busy. Try refreshing!</p>';
    }
}