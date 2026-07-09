// Self-executing setup to avoid loading conflicts
(function() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Game canvas element not found!");
        return;
    }
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

    window.addEventListener("keydown", (e) => {
        if ((e.code === "Space" || e.code === "ArrowUp") && dino.isGrounded && isPlaying) {
            dino.velocity = dino.jumpForce;
            dino.isGrounded = false;
        }
    });

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

        // Ground Floor Line
        ctx.strokeStyle = "#585b70"; 
        ctx.lineWidth = 3;
        ctx.beginPath(); 
        ctx.moveTo(0, 225); 
        ctx.lineTo(canvas.width, 225); 
        ctx.stroke();

        // Physics
        dino.velocity += dino.gravity; 
        dino.y += dino.velocity;
        
        if (dino.y >= 180) { 
            dino.y = 180; 
            dino.velocity = 0; 
            dino.isGrounded = true; 
        }
        
        // Draw Dino
        ctx.fillStyle = "#f38ba8"; 
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        gameTime++;
        if (gameTime % 80 === 0) { 
            spawnObstacle(); 
            gameSpeed += 0.3; 
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i]; 
            obs.x -= gameSpeed;
            
            // Draw Obstacles
            ctx.fillStyle = "#a6e3a1"; 
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // Collision Check
            if (dino.x < obs.x + obs.width && dino.x + dino.width > obs.x && dino.y < obs.y + obs.height && dino.y + dino.height > obs.y) {
                isPlaying = false;
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = "#f38ba8"; 
                ctx.font = "bold 32px sans-serif"; 
                ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
                
                ctx.fillStyle = "#cdd6f4";
                ctx.font = "16px sans-serif";
                ctx.fillText("Click Canvas to Try Again", canvas.width / 2 - 90, canvas.height / 2 + 40);
                
                if (typeof handleGameOver === 'function') {
                    handleGameOver(score);
                }
                return;
            }
            
            if (obs.x + obs.width < 0) { 
                obstacles.splice(i, 1); 
                score += 10; 
            }
        }

        // Render Score Overlay
        ctx.fillStyle = "#1e1e2e"; 
        ctx.font = "bold 20px monospace"; 
        ctx.fillText(`SCORE: ${score}`, 25, 40);
        
        requestAnimationFrame(gameLoop);
    }

    // Instantly draw initial click-to-play interface state so it isn't blank
    function renderSplash() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#313244";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("CLICK BOX TO START RUNNING", canvas.width / 2 - 180, canvas.height / 2 + 10);
    }
    renderSplash();
})();