function getDailySecret() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
}

function checkSecret() {
    const userInput = document.getElementById('secretInput').value.trim();
    const correctSecret = getDailySecret();

    if (userInput === correctSecret) {
        window.location.href = `auth.html?key=${correctSecret}`;
    } else {
        alert("Wrong answer! The goose eludes you.");
    }
}

function verifyAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const correctSecret = getDailySecret();

    if (key !== correctSecret) {
        window.location.href = 'index.html';
    }
}