// Verification check to make sure the canvas element is completely ready in the DOM
const canvas = document.getElementById("gameCanvas");

if (!canvas) {
    console.error("Dino Engine Error: #gameCanvas element could not be found in the DOM.");
} else {
    const ctx = canvas.getContext("2d");

    let score = 0;
    let gameTime = 0;
    let isPlaying = false;
    let obstacles = [];
    let gameSpeed = 6;

    const dino = { 
        x: 80, 
        y: 180, 
        width: 25, 
        height: 45, 
        gravity: 0.7, 
        velocity: 0, 
        jumpForce: -13, 
        isGrounded: true 
    };

    // Keyboard controls handler
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "ArrowUp") {
            if (!isPlaying) {
                resetGame();
            } else if (dino.isGrounded) {
                dino.velocity = dino.jumpForce;
                dino.isGrounded = false;
            }
            e.preventDefault(); // Stop spacebar from scrolling down the preview window
        }
    });

    // Mouse/Touch controls handler
    canvas.addEventListener("click", () => { 
        if (!isPlaying) resetGame(); 
    });

    function spawnObstacle() {
        let sizeHeight = Math.random() * (50 - 25) + 25;
        obstacles.push({ 
            x: canvas.width, 
            y: 225 - sizeHeight, 
            width: 20, 
            height: sizeHeight 
        });
    }

    function resetGame() {
        score = 0; 
        obstacles = []; 
        gameSpeed = 6; 
        dino.y = 180; 
        dino.velocity = 0; 
        dino.isGrounded = true; 
        isPlaying = true;
        gameLoop();
    }

    function gameLoop() {
        if (!isPlaying) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Ground Line
        ctx.strokeStyle = "#cdd6f4"; 
        ctx.lineWidth = 3;
        ctx.beginPath(); 
        ctx.moveTo(0, 225); 
        ctx.lineTo(canvas.width, 225); 
        ctx.stroke();

        // Run Dino Jump Physics
        dino.velocity += dino.gravity; 
        dino.y += dino.velocity;
        
        if (dino.y >= 180) { 
            dino.y = 180; 
            dino.velocity = 0; 
            dino.isGrounded = true; 
        }
        
        // Draw Player Character (Pink Box)
        ctx.fillStyle = "#f38ba8"; 
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        // Handle Obstacle Spawning Frequency
        gameTime++;
        if (gameTime % 90 === 0) { 
            spawnObstacle(); 
            gameSpeed += 0.25; 
        }

        // Loop through obstacles backwards to prevent screen flickering arrays
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i]; 
            obs.x -= gameSpeed;
            
            // Draw Obstacles (Green Box Cacti)
            ctx.fillStyle = "#a6e3a1"; 
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // AABB Collision Detection Engine
            if (dino.x < obs.x + obs.width && dino.x + dino.width > obs.x && dino.y < obs.y + obs.height && dino.y + dino.height > obs.y) {
                isPlaying = false;
                
                // Overlay game over banner
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = "#f38ba8"; 
                ctx.font = "bold 32px sans-serif"; 
                ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
                
                ctx.fillStyle = "#cdd6f4";
                ctx.font = "16px sans-serif";
                ctx.fillText("Click Canvas or Spacebar to Try Again", canvas.width / 2 - 130, canvas.height / 2 + 40);
                
                // Track score back to the database function inside game.html safely
                if (window.submitHighScore && typeof window.submitHighScore === "function") {
                    window.submitHighScore(score);
                }
                return;
            }
            
            // Clear past screen assets to keep runtime memory clean
            if (obs.x + obs.width < 0) { 
                obstacles.splice(i, 1); 
                score += 10; 
            }
        }

        // Render Scoreboard Layout
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "bold 22px monospace"; 
        ctx.fillText(`SCORE: ${score}`, 25, 40);
        
        requestAnimationFrame(gameLoop);
    }

    function renderSplash() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a6e3a1";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("CLICK CANVAS TO START GAME", canvas.width / 2 - 180, canvas.height / 2 + 10);
    }

    // Force run the splash text onto screen immediately upon link delivery
    renderSplash();
}