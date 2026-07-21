document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.page-home .main-title');
    if (heroTitle) {
        const originalTitleHtml = heroTitle.innerHTML;
        const scrambleChars = '01#/*<>{}_-+';
        const animatedChars = [];

        heroTitle.innerHTML = '';

        const appendAnimatedText = (text) => {
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.dataset.final = char;
                span.style.display = 'inline-block';
                span.style.whiteSpace = 'pre';
                span.style.opacity = '0';
                span.style.transform = 'translateY(24px)';
                span.style.transition = 'opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                heroTitle.appendChild(span);
                animatedChars.push(span);
            });
        };

        Array.from(new DOMParser().parseFromString(originalTitleHtml, 'text/html').body.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                appendAnimatedText(node.textContent);
            } else if (node.nodeName === 'BR') {
                heroTitle.appendChild(document.createElement('br'));
            }
        });

        animatedChars.forEach((span, index) => {
            const finalChar = span.dataset.final;
            const delay = index * 28;

            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';

                if (finalChar.trim() === '') return;

                let ticks = 0;
                const maxTicks = 5 + Math.floor(Math.random() * 4);
                const interval = setInterval(() => {
                    ticks++;
                    span.textContent = ticks >= maxTicks
                        ? finalChar
                        : scrambleChars[Math.floor(Math.random() * scrambleChars.length)];

                    if (ticks >= maxTicks) {
                        clearInterval(interval);
                    }
                }, 28);
            }, delay);
        });

        const totalAnimationTime = animatedChars.length * 28 + 900;
        setTimeout(() => {
            heroTitle.innerHTML = originalTitleHtml;
        }, totalAnimationTime);
    }

    // Smooth scroll reveal for project cards
    const cards = document.querySelectorAll('.project-card, .work-item');
    
    const revealOnScroll = () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (cardTop < windowHeight * 0.9) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize styles for scroll reveal
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Mouse movement interaction for the sun icon
    const sunIcon = document.querySelector('.sun-icon');
    if (sunIcon) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            sunIcon.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) rotate(${Date.now() / 50}deg)`;
        });
    }

    // Header pill interaction
    const pills = document.querySelectorAll('.nav-pill');
    pills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            pill.style.filter = 'brightness(1.1)';
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.filter = 'brightness(1)';
        });
    });
});
