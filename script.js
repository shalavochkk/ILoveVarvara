(() => {
    const startBtn = document.getElementById('startBtn');
    const heroSec = document.getElementById('heroSec');
    const mainScroller = document.getElementById('mainScroller');
    const rainCanvas = document.getElementById('rainCanvas');
    const ctx = rainCanvas.getContext('2d');
    
    const slide1 = document.getElementById('slide1');
    const slide2 = document.getElementById('slide2');
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');

    const sections = [slide1, slide2, slide3, slide4];
    let currentSlideIdx = 0;

    startBtn.addEventListener('click', () => {
        heroSec.style.opacity = '0';
        heroSec.style.transform = 'translateY(-100vh)';
        
        setTimeout(() => {
            heroSec.style.display = 'none';
            mainScroller.style.display = 'block';
            activateSlide(0);
        }, 1500); // Чуть увеличили задержку для плавности
    });

    function activateSlide(index) {
        if(index >= sections.length) return;
        currentSlideIdx = index;
        
        sections.forEach(sec => sec.classList.remove('active-slide'));
        
        const targetSection = sections[index];
        targetSection.classList.add('active-slide');
        
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (index === 1) {
            startRainEffect();
            startHeartsDropping();
        } else if (index === 3) {
            stopHeartsDropping();
            triggerFinalFountain();
        } else {
            stopHeartsDropping();
        }
    }

    slide1.addEventListener('click', () => activateSlide(1));
    slide2.addEventListener('click', () => activateSlide(2));

    const clickInstruction = document.getElementById('clickInstruction');
    const messagesFeed = document.getElementById('messagesFeed');
    
    const loveReasons = [
        "Я люблю тебя за твое бесконечное внимание и заботу 💙",
        "За то, как мило ты разговариваешь, когда сильно устала ✨",
        "За твою невероятную улыбку, которая освещает любые хмурые дни ☀️",
        "За то, что ты умеешь понимать меня абсолютно без лишних слов 🫂",
        "За невероятное тепло, которое ты даришь, несмотря на любые расстояния 🌍",
        "За то, что ты — моя самая главная поддержка, опора и вдохновение 💎",
        "И самое главное — за то, что ты вообще у меня есть 🥰"
    ];
    let msgIdx = 0;

    slide3.addEventListener('click', () => {
        if (msgIdx === 0) {
            clickInstruction.style.opacity = '0';
            setTimeout(() => clickInstruction.style.display = 'none', 600);
        }

        if (msgIdx < loveReasons.length) {
            const msgBubble = document.createElement('div');
            msgBubble.className = 'bubble-msg';
            msgBubble.textContent = loveReasons[msgIdx];
            
            messagesFeed.insertBefore(msgBubble, messagesFeed.firstChild);
            
            setTimeout(() => {
                msgBubble.classList.add('appear');
            }, 50);
            
            msgIdx++;
        } else {
            activateSlide(3);
        }
    });

    let rainDrops = [];
    let animationFrameId = null;

    function resizeRainCanvas() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeRainCanvas);
    resizeRainCanvas();

    function startRainEffect() {
        rainCanvas.style.opacity = '0.2'; 
        
        if (rainDrops.length === 0) {
            for (let i = 0; i < 50; i++) {
                rainDrops.push({
                    x: Math.random() * rainCanvas.width,
                    y: Math.random() * rainCanvas.height,
                    speed: Math.random() * 1.5 + 1.0,
                    len: Math.random() * 15 + 10,
                    opacity: Math.random() * 0.1 + 0.05
                });
            }
        }

        function renderRain() {
            ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
            rainDrops.forEach(d => {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x, d.y + d.len);
                ctx.strokeStyle = `rgba(147, 197, 253, ${d.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                d.y += d.speed;
                if (d.y > rainCanvas.height) {
                    d.y = -d.len;
                    d.x = Math.random() * rainCanvas.width;
                }
            });
            animationFrameId = requestAnimationFrame(renderRain);
        }
        renderRain();
    }

    let dropInterval = null;
    const heartPalettes = ['💙', '🩵', '✨', '💎'];

    function spawnSingleHeart() {
        const heart = document.createElement('div');
        heart.className = 'ios-heart-drop';
        heart.textContent = heartPalettes[Math.floor(Math.random() * heartPalettes.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        
        const scale = Math.random() * 0.5 + 0.5; 
        heart.style.transform = `scale(${scale})`;
        heart.style.opacity = Math.random() * 0.4 + 0.1;
        
        const duration = Math.random() * 4 + 6; 
        heart.style.animationDuration = duration + 's';
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }

    function startHeartsDropping() {
        if(!dropInterval) dropInterval = setInterval(spawnSingleHeart, 1200);
    }

    function stopHeartsDropping() {
        if(dropInterval) {
            clearInterval(dropInterval);
            dropInterval = null;
        }
    }

    function triggerFinalFountain() {
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.textContent = heartPalettes[Math.floor(Math.random() * heartPalettes.length)];
                el.style.position = 'fixed';
                el.style.left = (Math.random() * 90 + 5) + 'vw';
                el.style.bottom = '-50px';
                el.style.fontSize = (Math.random() * 18 + 14) + 'px';
                el.style.pointerEvents = 'none';
                el.style.zIndex = '99';
                el.style.opacity = '0.7';
                el.style.transition = 'all 4s cubic-bezier(0.1, 0.8, 0.2, 1)';
                document.body.appendChild(el);

                setTimeout(() => {
                    const drift = (Math.random() - 0.5) * 200;
                    el.style.transform = `translate(${drift}px, -${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                    el.style.opacity = '0';
                }, 50);

                setTimeout(() => el.remove(), 4000);
            }, i * 120);
        }
    }
})();
