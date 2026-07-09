// Function to get today's date string (YYYY-MM-DD)
function getDailySecret() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
}

// Checked when a user submits their guess on the homepage
function checkSecret() {
    const userInput = document.getElementById('secretInput').value.trim();
    const correctSecret = getDailySecret();

    if (userInput === correctSecret) {
        // Redirect them to the game page with the secret key in the URL
        window.location.href = `game.html?key=${correctSecret}`;
    } else {
        alert("Wrong answer! The goose eludes you.");
    }
}

// Guard clause for the game page to make sure they didn't cheat
function verifyAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const correctSecret = getDailySecret();

    if (key !== correctSecret) {
        // Kick them back to the hunt page if the key is missing or old
        window.location.href = 'index.html';
    }
}