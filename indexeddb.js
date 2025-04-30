// Open (or create) the IndexedDB database
const request = indexedDB.open("GameProfileDB", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create an object store (like a table)
    const objectStore = db.createObjectStore("profiles", { keyPath: "username" });

    // Create indexes for additional fields
    objectStore.createIndex("studentName", "studentName", { unique: false });
    objectStore.createIndex("gradeSection", "gradeSection", { unique: false });
};

// Add Profile Function
function addProfile(profile) {
    const dbRequest = indexedDB.open("GameProfileDB", 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("profiles", "readwrite");
        const objectStore = transaction.objectStore("profiles");

        const addRequest = objectStore.add(profile);

        addRequest.onsuccess = () => {
            alert("Profile created successfully!");
            window.location.href = "log-in.html"; // Redirect after sign-up
        };

        addRequest.onerror = () => {
            alert("Username already exists. Please try another.");
        };
    };
}

// Update Profile Function (including Grade/Section)
function updateProfile(profile) {
    const dbRequest = indexedDB.open("GameProfileDB", 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("profiles", "readwrite");
        const objectStore = transaction.objectStore("profiles");

        const updateRequest = objectStore.put(profile);

        updateRequest.onsuccess = () => {
            alert("Profile updated successfully!");
            loadUserProfile(); // Refresh sidebar display
        };

        updateRequest.onerror = () => {
            alert("Error updating profile.");
        };
    };
}

// Get Profile Function
function getProfile(username, callback) {
    const dbRequest = indexedDB.open("GameProfileDB", 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("profiles", "readonly");
        const objectStore = transaction.objectStore("profiles");

        const getRequest = objectStore.get(username);

        getRequest.onsuccess = () => {
            callback(getRequest.result);
        };

        getRequest.onerror = () => {
            callback(null); // Profile not found
        };
    };
}

// Load Profile on Page Load
window.onload = function () {
    const savedUsername = localStorage.getItem('username');

    if (savedUsername) {
        getProfile(savedUsername, (profile) => {
            if (profile) {
                document.getElementById('avatars').src = profile.avatar || 'Avatar.png';
                document.getElementById('username-display').innerText = profile.studentName || 'PLAYER NAME';
                document.getElementById('gradesection-display').innerText = profile.gradeSection || 'GRADE/SECTION';
            }
        });
    }
};

function getProfile(username, callback) {
    const dbRequest = indexedDB.open("GameProfileDB", 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("profiles", "readonly");
        const objectStore = transaction.objectStore("profiles");

        const getRequest = objectStore.get(username);

        getRequest.onsuccess = () => {
            const profile = getRequest.result;
            callback(profile);
        };

        getRequest.onerror = () => {
            callback(null); // Profile not found
        };
    };
}

