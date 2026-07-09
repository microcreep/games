// Function to get today's date string dynamically (YYYY-MM-DD)
function getDailySecret() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
}

// Executed when a user submits their guess on index.html
function checkSecret() {
    const userInput = document.getElementById('secretInput').value.trim();
    const correctSecret = getDailySecret();

    if (userInput === correctSecret) {
        // Redirect them to the main menu selection page while forwarding the security token
        window.location.href = `arcade.html?key=${correctSecret}`;
    } else {
        alert("Wrong answer! The goose eludes you.");
    }
}

// Guard logic to prevent bypassing or using expired session links
function verifyAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const correctSecret = getDailySecret();

    if (key !== correctSecret) {
        // Access denied: boot them back to the hunt portal
        window.location.href = 'index.html';
    }
}