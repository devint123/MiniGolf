const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ball properties
let ball = {
    x: 100,
    y: 300,
    radius: 8,
    dx: 0,
    dy: 0,
    power: 0,
    angle: 0,
    moving: false
};

// Hole properties (Multiple holes)
const holes = [
    { x: 500, y: 300, radius: 10 },
    { x: 450, y: 250, radius: 10 },
    { x: 400, y: 200, radius: 10 },
    { x: 550, y: 100, radius: 10 },
    { x: 300, y: 350, radius: 10 },
    { x: 200, y: 150, radius: 10 },
    { x: 500, y: 50, radius: 10 },
    { x: 350, y: 275, radius: 10 },
    { x: 150, y: 100, radius: 10 }
];

let currentHoleIndex = 0; // Track the current hole

// Game state
let strokes = 0;
let aiming = false;
let startX, startY;

// Handle mouse down (start aiming)
canvas.addEventListener("mousedown", (e) => {
    if (!ball.moving) {
        aiming = true;
        startX = e.offsetX;
        startY = e.offsetY;
    }
});

// Handle mouse up (launch ball)
canvas.addEventListener("mouseup", (e) => {
    if (aiming) {
        aiming = false;
        let dx = startX - e.offsetX;
        let dy = startY - e.offsetY;
        ball.power = Math.min(Math.sqrt(dx * dx + dy * dy) / 5, 10); // Limit power
        ball.angle = Math.atan2(dy, dx);
        ball.dx = Math.cos(ball.angle) * ball.power;
        ball.dy = Math.sin(ball.angle) * ball.power;
        ball.moving = true;
        strokes++;
    }
});

// Update game logic
function update() {
    if (ball.moving) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Apply friction
        ball.dx *= 0.98;
        ball.dy *= 0.98;
        
        // Border collision detection
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.dx = -ball.dx * 0.8; // Reduce speed slightly on bounce
        }
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.dx = -ball.dx * 0.8;
        }
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.dy = -ball.dy * 0.8;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.dy = -ball.dy * 0.8;
        }

        // Stop ball if speed is low
        if (Math.abs(ball.dx) < 0.1 && Math.abs(ball.dy) < 0.1) {
            ball.moving = false;
            ball.dx = 0;
            ball.dy = 0;
        }
    }

    // Check if ball is in the hole
    let hole = holes[currentHoleIndex];
    let dist = Math.sqrt((ball.x - hole.x) ** 2 + (ball.y - hole.y) ** 2);
    if (dist < hole.radius) {
        alert(`Hole ${currentHoleIndex + 1} completed in ${strokes} strokes!`);
        currentHoleIndex++;
        if (currentHoleIndex < holes.length) {
            resetGame();
        } else {
            alert("Game Completed! Well done!");
            currentHoleIndex = 0; // Reset game
            resetGame();
        }
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the current hole
    let hole = holes[currentHoleIndex];
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
}

// Reset game state
function resetGame() {
    ball.x = 100;
    ball.y = 300;
    ball.dx = 0;
    ball.dy = 0;
    ball.moving = false;
    strokes = 0;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
