const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0, gameTime = 0, isPlaying = false, obstacles = [], gameSpeed = 5;
const dino = { x: 50, y: 100, width: 20, height: 30, gravity: 0.6, velocity: 0, jumpForce: -10, isGrounded: true };

window.addEventListener("keydown", (e) => {
    if ((e.code === "Space" || e.code === "ArrowUp") && dino.isGrounded && isPlaying) {
        dino.velocity = dino.jumpForce;
        dino.isGrounded = false;
    }
});

canvas.addEventListener("click", () => { if (!isPlaying) resetGame(); });

function spawnObstacle() {
    let size = Math.random() * (30 - 15) + 15;
    obstacles.push({ x: canvas.width, y: canvas.height - size, width: 15, height: size });
}

function resetGame() {
    score = 0; obstacles = []; gameSpeed = 5; dino.y = 100; dino.velocity = 0; dino.isGrounded = true; isPlaying = true;
    gameLoop();
}

function gameLoop() {
    if (!isPlaying) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#585b70"; ctx.beginPath(); ctx.moveTo(0, 130); ctx.lineTo(canvas.width, 130); ctx.stroke();

    dino.velocity += dino.gravity; dino.y += dino.velocity;
    if (dino.y >= 100) { dino.y = 100; dino.velocity = 0; dino.isGrounded = true; }
    ctx.fillStyle = "#f38ba8"; ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    gameTime++;
    if (gameTime % 100 === 0) { spawnObstacle(); gameSpeed += 0.2; }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i]; obs.x -= gameSpeed;
        ctx.fillStyle = "#a6e3a1"; ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (dino.x < obs.x + obs.width && dino.x + dino.width > obs.x && dino.y < obs.y + obs.height && dino.y + dino.height > obs.y) {
            isPlaying = false;
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#f38ba8"; ctx.font = "24px sans-serif"; ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2);
            
            // Call the shared container function to submit score to database
            handleGameOver(score);
            return;
        }
        if (obs.x + obs.width < 0) { obstacles.splice(i, 1); score += 10; }
    }

    ctx.fillStyle = "#11111b"; ctx.font = "16px sans-serif"; ctx.fillText(`Score: ${score}`, 20, 30);
    requestAnimationFrame(gameLoop);
}