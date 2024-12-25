const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];
const fireworks = [];
let score = 0;

const clickSound = document.getElementById('click-sound');

// 調整畫布大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 生成雪花
function createSnowflake() {
    return {
        x: Math.random() * canvas.width,
        y: -10,
        radius: Math.random() * 5 + 5, // 增大雪花半徑範圍
        speed: Math.random() * 0.5 + 0.5, // 減慢雪花移動速度
    };
}

// 更新雪花位置
function updateSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach((snowflake, index) => {
        snowflake.y += snowflake.speed;

        // 如果雪花超出屏幕，重新生成
        if (snowflake.y > canvas.height) {
            snowflakes.splice(index, 1);
            snowflakes.push(createSnowflake());
        }

        // 繪製雪花
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

// 初始化雪花
for (let i = 0; i < 100; i++) {
    snowflakes.push(createSnowflake());
}

// 點擊雪花處理並觸發煙火
canvas.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    snowflakes.forEach((snowflake, index) => {
        const dist = Math.hypot(snowflake.x - clickX, snowflake.y - clickY);

        // 將點擊範圍擴大到雪花半徑的 1.5 倍
        if (dist < snowflake.radius * 1.5) {
            snowflakes.splice(index, 1);
            snowflakes.push(createSnowflake());
            score += 1;
            document.getElementById('score').innerText = score;

            // 播放音效
            clickSound.play();

            // 添加煙火
            createFirework(clickX, clickY);
        }
    });
});

// 生成煙火
function createFirework(x, y) {
    for (let i = 0; i < 20; i++) {
        fireworks.push({
            x,
            y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 3 + 2,
            radius: Math.random() * 3 + 2,
            alpha: 1,
        });
    }
}

// 更新煙火效果
function updateFireworks() {
    fireworks.forEach((firework, index) => {
        firework.x += Math.cos(firework.angle) * firework.speed;
        firework.y += Math.sin(firework.angle) * firework.speed;
        firework.alpha -= 0.02;

        // 如果煙火透明度變為 0，移除
        if (firework.alpha <= 0) {
            fireworks.splice(index, 1);
        }

        // 繪製煙火
        ctx.beginPath();
        ctx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.random() * 255}, 0, ${firework.alpha})`;
        ctx.fill();
        ctx.closePath();
    });
}

// 遊戲主循環
function animate() {
    updateSnowflakes();
    updateFireworks();
    requestAnimationFrame(animate);
}

// 啟動動畫
animate();
