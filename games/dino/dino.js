<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Goose Arcade - Execution Core</title>
    <style>
        body { background: #1e1e2e; color: #fff; font-family: sans-serif; text-align: center; margin: 0; padding: 20px; }
        .navigation-row { display: flex; justify-content: space-between; align-items: center; max-width: 900px; margin: 0 auto 20px auto; }
        .back-btn { padding: 10px 20px; background: #f38ba8; border: none; border-radius: 6px; cursor: pointer; color: #11111b; font-weight: bold; font-size: 14px; }
        .player-tag { font-size: 14px; color: #fab387; font-weight: bold; background: #313244; padding: 8px 14px; border-radius: 20px; }
        
        #game-area { max-width: 1000px; margin: 0 auto; }
        canvas { background: #252636; display: block; margin: 20px auto; border-radius: 8px; border: 4px solid #cdd6f4; box-shadow: 0 8px 24px rgba(0,0,0,0.5); width: 100%; max-width: 800px; height: 250px; cursor: pointer; }

        .leaderboard-box { margin: 40px auto; background: #313244; padding: 20px; border-radius: 10px; max-width: 400px; text-align: left; }
        .leaderboard-box h3 { text-align: center; margin-top: 0; color: #f5e0dc; border-bottom: 2px solid #45475a; padding-bottom: 10px; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { padding: 8px 0; border-bottom: 1px solid #45475a; display: flex; justify-content: space-between; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>

    <div class="navigation-row">
        <button class="back-btn" onclick="goBackToArcade()">⬅ Return to Arcade Grid</button>
        <div id="playerTag" class="player-tag">Player Profile Status</div>
    </div>

    <div id="game-area">
        <h2 id="game-title">LOADING ENGINE...</h2>
        <p style="color: #a6adc8;">Controls: Click inside the canvas to start. Use <strong>Spacebar</strong> or <strong>Up Arrow</strong> to jump.</p>
        <canvas id="gameCanvas" width="800" height="250"></canvas>
    </div>

    <div class="leaderboard-box">
        <h3>Top Arcade Run Logs</h3>
        <ul id="leaderboard-list">
            <li>Syncing live leaderboard matrix...</li>
        </ul>
    </div>

    <script src="app.js"></script>
    <script>
        try { verifyAccess(); } catch(e) {}

        const urlParams = new URLSearchParams(window.location.search);
        const userData = localStorage.getItem('goose_user');
        let activeUser = null;

        if (!userData) {
            activeUser = { display_name: "Guest Player" };
            document.getElementById('playerTag').innerText = `🎮 Active: Guest Mode`;
        } else {
            activeUser = JSON.parse(userData);
            document.getElementById('playerTag').innerText = `🎮 Active: ${activeUser.display_name}`;
        }

        const SUPABASE_URL = 'https://xkyvyyjlexeadaqgexgw.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_ZytZF6HwieXZuAKcMNX_vQ_IjX8gduC';
        let supabase = null;

        try {
            if (window.supabase) {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        } catch (err) { console.error(err); }

        async function fetchLiveLeaderboard() {
            const container = document.getElementById('leaderboard-list');
            if (!supabase) {
                container.innerHTML = '<li>1. Local Admin <strong>1,500 pts</strong></li>';
                return;
            }
            try {
                const { data, error } = await supabase.from('leaderboards').select('display_name, score').order('score', { ascending: false }).limit(10);
                if (error) throw error;
                container.innerHTML = '';
                if(!data || data.length === 0) {
                    container.innerHTML = '<li>No records yet. Score first!</li>';
                    return;
                }
                data.forEach((row, i) => {
                    container.innerHTML += `<li><span>${i + 1}. ${row.display_name}</span> <strong>${row.score} pts</strong></li>`;
                });
            } catch(e) {
                container.innerHTML = '<li>1. Local Admin <strong>1,500 pts</strong></li>';
            }
        }

        window.submitHighScore = async function(finalScore) {
            if (!activeUser || !supabase) return;
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                await supabase.from('leaderboards').insert({
                    user_id: session.user.id,
                    display_name: activeUser.display_name,
                    score: finalScore
                });
                fetchLiveLeaderboard();
            } catch(err) { console.error("Score submit error:", err); }
        }

        function goBackToArcade() {
            const key = urlParams.get('key') || 'arcade';
            window.location.href = `arcade.html?key=${key}`;
        }

        // --- FIXED INJECTION ENGINE ---
        // If ?game is empty, we force it to look for 'dino'
        const activeGame = urlParams.get('game') || 'dino';
        document.getElementById('game-title').innerText = activeGame.toUpperCase() + " RUNNER";

        const scriptPipeline = document.createElement('script');
        // Looks directly inside your games/dino/dino.js path
        scriptPipeline.src = `games/${activeGame}/${activeGame}.js`;
        document.body.appendChild(scriptPipeline);

        fetchLiveLeaderboard();
    </script>
    <script defer src="/_vercel/insights/script.js"></script>   
</body>
</html>