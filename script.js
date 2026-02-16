canvas.focus(); // 頁面載入後自動聚焦在遊戲

// 修改後的監聽器，增加 console 日誌方便你測試
document.addEventListener("keydown", (e) => { 
    if (e.code === "Space") {
        e.preventDefault(); // 防止網頁捲動
        horse.jump();
        console.log("偵測到跳躍動作！"); 
    }
});

// 針對手機或滑鼠點擊
document.addEventListener("mousedown", () => {
    horse.jump();
});
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = 800;
canvas.height = 200;

// 遊戲變數
let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// 1. 馬的設定
const horse = {
    x: 50,
    y: 140,
    width: 60,
    height: 60,
    dy: 0,
    jumpForce: 15,
    gravity: 0.8,
    grounded: false,
    draw() {
        ctx.fillStyle = ""#fbc02d""; // 這裡之後可以換成 ctx.drawImage(你的馬.png)
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText("🐎", this.x, this.y + 30); // 暫時用 Emoji 代替
    },
    jump() {
        if (this.grounded) {
            this.dy = -this.jumpForce;
            this.grounded = false;
        }
    },
    update() {
        if (this.y + this.height < canvas.height) {
            this.dy += this.gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.height;
        }
        this.y += this.dy;
        this.draw();
    }
};

// 2. 障礙物（紅包）設定
const obstacles = [];
function spawnObstacle() {
    let size = Math.random() * 30 + 20;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: size,
        height: size,
        draw() {
            ctx.fillStyle = "#d32f2f";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "white";
            ctx.fillText("🧧", this.x + 5, this.y + 20);
        }
    });
}

// 3. 遊戲主迴圈
let timer = 0;
function animate() {
    if (isGameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer++;
    
    horse.update();

    if (timer % 100 === 0) spawnObstacle();

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        obstacle.draw();

        // 碰撞偵測
        if (
            horse.x < obstacle.x + obstacle.width &&
            horse.x + horse.width > obstacle.x &&
            horse.y < obstacle.y + obstacle.height &&
            horse.y + horse.height > obstacle.y
        ) {
            gameOver();
        }

        // 移除出鏡障礙物
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.innerText = `分數: ${score}`;
            if (score % 5 === 0) gameSpeed += 0.2; // 越來越快
        }
    });

    requestAnimationFrame(animate);
}

function gameOver() {
    isGameOver = true;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("馬失前蹄！按重新整理再試一次", canvas.width/2 - 200, canvas.height/2);
}

// 監聽操作
window.addEventListener("keydown", (e) => { if (e.code === "Space") horse.jump(); });
window.addEventListener("touchstart", () => horse.jump());


animate();



