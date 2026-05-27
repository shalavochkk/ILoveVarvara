(() => {
const starCanvas = document.getElementById('starCanvas');
const sCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStar() {
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            r: Math.random() * 1.2 + 0.2,
            o: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.0004 + 0.0001,
            phase: Math.random() * Math.PI * 2
        });
    }
}
window.addEventListener('resize', resizeStar);
resizeStar();

let t = 0;
function drawStars() {
    t += 0.016;
    sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(s => {
        const alpha = s.o * (0.6 + 0.4 * Math.sin(t * s.speed * 200 + s.phase));
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(147,197,253,${alpha})`;
        sCtx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

const rainCanvas = document.getElementById('rainCanvas');
const rCtx = rainCanvas.getContext('2d');
let drops = [], rainAnim = null;

function resizeRain() {
    rainCanvas.width  = window.innerWidth;
    rainCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeRain);
resizeRain();

function startRain() {
    rainCanvas.style.opacity = '0.25';
    if (!drops.length) {
        for (let i = 0; i < 55; i++) {
            drops.push({
                x: Math.random() * rainCanvas.width,
                y: Math.random() * rainCanvas.height,
                speed: Math.random() * 1.6 + 0.8,
                len: Math.random() * 16 + 8,
                op: Math.random() * 0.12 + 0.04
            });
        }
    }
    const loop = () => {
        rCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        drops.forEach(d => {
            rCtx.beginPath();
            rCtx.moveTo(d.x, d.y);
            rCtx.lineTo(d.x - 1, d.y + d.len);
            rCtx.strokeStyle = `rgba(147,197,253,${d.op})`;
            rCtx.lineWidth = 1.2;
            rCtx.stroke();
            d.y += d.speed;
            if (d.y > rainCanvas.height) { d.y = -d.len; d.x = Math.random() * rainCanvas.width; }
        });
        rainAnim = requestAnimationFrame(loop);
    };
    loop();
}
function stopRain() {
    rainCanvas.style.opacity = '0';
    if (rainAnim) { cancelAnimationFrame(rainAnim); rainAnim = null; }
}

const palette = ['💙','🩵','✨','💎'];
let heartInterval = null;

function spawnHeart() {
    const el = document.createElement('div');
    el.className = 'ios-heart-drop';
    el.textContent = palette[Math.floor(Math.random() * palette.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const dur = Math.random() * 5 + 7;
    el.style.animationDuration = dur + 's';
    el.style.fontSize = (Math.random() * 10 + 16) + 'px';
    el.style.opacity = (Math.random() * 0.35 + 0.1).toString();
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
}
function startHearts() { if (!heartInterval) heartInterval = setInterval(spawnHeart, 1100); }
function stopHearts()  { clearInterval(heartInterval); heartInterval = null; }

function fountain() {
    for (let i = 0; i < 45; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.textContent = palette[Math.floor(Math.random() * palette.length)];
            Object.assign(el.style, {
                position: 'fixed',
                left: (Math.random() * 86 + 7) + 'vw',
                bottom: '-40px',
                fontSize: (Math.random() * 16 + 12) + 'px',
                pointerEvents: 'none',
                zIndex: '99',
                opacity: '0.8',
                transition: 'all 4.5s cubic-bezier(0.1,0.8,0.15,1)'
            });
            document.body.appendChild(el);
            setTimeout(() => {
                el.style.transform = `translate(${(Math.random()-0.5)*180}px, -${window.innerHeight + 80}px) rotate(${Math.random()*400}deg)`;
                el.style.opacity = '0';
            }, 30);
            setTimeout(() => el.remove(), 5000);
        }, i * 100);
    }
}

const slides  = ['slide1','slide2','slide3','slide4'].map(id => document.getElementById(id));
const cards   = ['card1','card2','card3','card4'].map(id => document.getElementById(id));
const aurora  = document.getElementById('aurora');
let current   = -1;

function showSlide(idx, prevIdx) {
    if (prevIdx >= 0) {
        slides[prevIdx].style.pointerEvents = 'none';
        cards[prevIdx].classList.remove('slide-enter');
        cards[prevIdx].classList.add('slide-exit');
        setTimeout(() => cards[prevIdx].classList.add('gone'), 20);
        setTimeout(() => { slides[prevIdx].style.display = 'none'; }, 750);
    }

    slides[idx].style.display = 'flex';
    slides[idx].style.pointerEvents = 'auto';
    cards[idx].classList.remove('slide-exit','gone');
    cards[idx].classList.add('slide-enter');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => cards[idx].classList.add('visible'));
    });

    current = idx;

    if (idx === 1) { aurora.classList.add('visible'); startRain(); startHearts(); }
    else if (idx === 3) { stopHearts(); stopRain(); fountain(); aurora.classList.add('visible'); }
    else { stopHearts(); }

    slides.forEach((s, i) => { if (i !== idx && i !== prevIdx) s.style.display = 'none'; });
}

const heroSec = document.getElementById('heroSec');
const mainScroller = document.getElementById('mainScroller');

document.getElementById('startBtn').addEventListener('click', () => {
    heroSec.style.opacity = '0';
    heroSec.style.transform = 'translateY(-60px) scale(0.97)';
    setTimeout(() => {
        heroSec.style.display = 'none';
        mainScroller.style.display = 'block';
        showSlide(0, -1);
    }, 1400);
});

slides[0].addEventListener('click', () => { if (current === 0) showSlide(1, 0); });
slides[1].addEventListener('click', () => { if (current === 1) showSlide(2, 1); });

const tapPrompt    = document.getElementById('tapPrompt');
const messagesFeed = document.getElementById('messagesFeed');
const loveReasons  = [
    "Я люблю тебя за твое бесконечное внимание и заботу 💙",
    "За то, как мило ты разговариваешь, когда сильно устала 💙",
    "За то, что ты умеешь понимать меня абсолютно без лишних слов 💙",
    "За невероятное тепло, которое ты даришь, несмотря на любые расстояния 💙",
    "И самое главное — за то, что ты вообще у меня есть 💙"
];
let msgIdx = 0;

slides[2].addEventListener('click', () => {
    if (current !== 2) return;

    if (msgIdx === 0) {
        tapPrompt.style.opacity = '0';
        setTimeout(() => tapPrompt.style.display = 'none', 600);
    }

    if (msgIdx < loveReasons.length) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-msg';
        bubble.textContent = loveReasons[msgIdx];
        messagesFeed.insertBefore(bubble, messagesFeed.firstChild);
        messagesFeed.scrollTop = 0;
        requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.add('appear')));
        msgIdx++;
    } else {
        showSlide(3, 2);
    }
});

slides.forEach((s, i) => { if (i > 0) s.style.display = 'none'; });

})();
