(() => {
    const hero = document.querySelector('.hero');
    const heartBlue = document.querySelector('.heart-blue-svg');
    const heartPink = document.querySelector('.heart-pink-svg');
    const mergedHeart = document.querySelector('.merged-heart-svg');
    const slidesContainer = document.getElementById('slides');
    const slides = document.querySelectorAll('.slide');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    const loveReasons = [
        { text: "Я люблю тебя за твое бесконечное внимание и заботу"},
        { text: "За то, как мило ты разговариваешь, когда сильно устала"},
        { text: "За твою невероятную улыбку, которая освещает даже самые хмурые дни"},
        { text: "За то, что ты умеешь понимать меня абсолютно без лишних слов"},
        { text: "За невероятное тепло, которое ты даришь, несмотря на любые расстояния" },
        { text: "За то, что ты — моя самая главная поддержка, опора и вдохновение" },
        { text: "И самое главное — за то, что ты вообще у меня есть" },
        { text: "Я ТЕБЯ ОЧЕНЬ СИЛЬНО ЛЮБЛЮ" },
        { text: "НАВСЕГДА - ТВОЙ НИКИТКА" }
    ];

    let typingStarted = false;
    let textTypingFinished = false;

    setTimeout(() => hero.classList.add('animate'), 50);
    
    setTimeout(() => {
        heartBlue.classList.add('crash');
        heartPink.classList.add('crash');
        
        setTimeout(() => {
            createPremiumExplosion();
            mergedHeart.classList.add('show');
        }, 200); 
        
        setTimeout(() => {
            hero.style.opacity = '0';
            hero.style.transition = 'opacity 0.5s cubic-bezier(0.15, 1, 0.3, 1)';
            setTimeout(() => {
                hero.style.display = 'none';
                initSlides();
                initParticles();
            }, 500);
        }, 1000);
    }, 1200);
    
    function createPremiumExplosion() {
        for(let i = 0; i < 45; i++) {
            const particle = document.createElement('div');
            const colors = ['#ff2d55', '#ff3b30', '#ffffff'];
            particle.style.position = 'fixed';
            particle.style.left = '50%';
            particle.style.top = '40%';
            const size = Math.random() * 3 + 2; 
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            document.body.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 3;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity - 2;
            let x = window.innerWidth / 2;
            let y = window.innerHeight * 0.4;
            let opacity = 1;
            
            function animate() {
                x += vx; y += vy; vy += 0.16; opacity -= 0.025;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = opacity;
                if(opacity > 0) { requestAnimationFrame(animate); } else { particle.remove(); }
            }
            requestAnimationFrame(animate);
        }
    }
    
    function initSlides() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    if (entry.target.id === 'typingSlide') {
                        if (!typingStarted) {
                            typingStarted = true;
                            startLiveTyping();
                        }
                    }
                    
                    if (entry.target.classList.contains('final-slide')) {
                        createFinalHeartsUpward();
                    }
                }
            });
        }, { threshold: 0.35 }); 
        
        slides.forEach(slide => observer.observe(slide));
        slides[0].classList.add('active');
    }

    function startLiveTyping() {
        const listContainer = document.getElementById('liveList');
        let itemIndex = 0;

        function typeNextItem() {
            if (itemIndex >= loveReasons.length) {
                textTypingFinished = true;
                return;
            }

            const itemData = loveReasons[itemIndex];
            const li = document.createElement('li');

            const textSpan = document.createElement('span');
            textSpan.className = 'li-text';
            li.appendChild(textSpan);
            
            listContainer.appendChild(li);
            
            setTimeout(() => {
                li.classList.add('show');
                li.classList.add('typing');
            }, 20);

            let charIndex = 0;
            const fullText = itemData.text;

            function typeChar() {
                if (charIndex < fullText.length) {
                    textSpan.textContent += fullText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 18); 
                } else {
                    li.classList.remove('typing');
                    itemIndex++;
                    setTimeout(typeNextItem, 250); 
                }
            }
            
            setTimeout(typeChar, 150);
        }

        typeNextItem();
    }
    
    function initParticles() {
        let particles = [];
        const particleCount = 40;
        for(let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 0.9 + 0.4,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                color: `rgba(255, 255, 255, ${Math.random() * 0.08 + 0.04})`
            });
        }
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        function animate() {
            if(!canvas.parentElement) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if(p.x < 0) p.x = canvas.width; if(p.x > canvas.width) p.x = 0;
                if(p.y < 0) p.y = canvas.height; if(p.y > canvas.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        window.addEventListener('resize', resize);
        resize(); animate();
    }
    
    function createFinalHeartsUpward() {
        for(let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                const icons = ['❤️', '💖', '💗', '💕'];
                heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.bottom = '-40px';
                heart.style.fontSize = Math.random() * 12 + 14 + 'px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.style.transition = 'all 4s cubic-bezier(0.1, 0.8, 0.2, 1)';
                heart.style.opacity = '0.65';
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.style.transform = `translateY(-${window.innerHeight + 80}px) rotate(${(Math.random() - 0.5) * 30}deg)`;
                    heart.style.opacity = '0';
                }, 20);
                setTimeout(() => heart.remove(), 4000);
            }, i * 140);
        }
    }
})();