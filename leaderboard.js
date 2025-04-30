// Open (or create) the IndexedDB database
const DB_NAME = "LeaderboardDB";
const STORE_NAME = "scores";

const request = indexedDB.open(DB_NAME, 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });

    objectStore.createIndex("playerName", "playerName", { unique: false });
    objectStore.createIndex("gradeSection", "gradeSection", { unique: false });
    objectStore.createIndex("score", "score", { unique: false });
};

// Function to add score
function addScore(playerName, score) {
    const dbRequest = indexedDB.open(DB_NAME, 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const objectStore = transaction.objectStore(STORE_NAME);

        const newScore = {
            playerName: playerName,
            score: score
        };

        objectStore.add(newScore);

        transaction.oncomplete = () => {
            alert("Score successfully saved!");
            displayLeaderboard(); // Refresh leaderboard
        };
    };
}

// Function to display leaderboard
function displayLeaderboard() {
    const dbRequest = indexedDB.open(DB_NAME, 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, "readonly");
        const objectStore = transaction.objectStore(STORE_NAME);

        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";

        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = (e) => {
            const scores = e.target.result;

            // Sort by score (highest first)
            scores.sort((a, b) => b.score - a.score);

            scores.forEach((entry, index) => {
                const scoreEntry = document.createElement('p');
                scoreEntry.textContent = `${index + 1}. ${entry.playerName} - ${entry.score}`;
                leaderboardContainer.appendChild(scoreEntry);
            });
        };
    };
}

