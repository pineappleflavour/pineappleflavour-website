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

    // Gooey transition for the shared header navigation.
    const nav = document.querySelector('.header .nav');
    if (nav) {
        const pills = Array.from(nav.querySelectorAll('.nav-pill'));
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const effect = document.createElement('span');
        effect.className = 'gooey-nav-effect gooey-nav-effect--pill';
        nav.appendChild(effect);

        const positionEffect = pill => {
            const navBox = nav.getBoundingClientRect();
            const pillBox = pill.getBoundingClientRect();
            Object.assign(effect.style, {
                left: `${pillBox.left - navBox.left}px`,
                top: `${pillBox.top - navBox.top}px`,
                width: `${pillBox.width}px`,
                height: `${pillBox.height}px`
            });
        };

        const createParticles = pill => {
            const color = getComputedStyle(document.body).getPropertyValue('--nav-active-bg').trim();
            effect.style.setProperty('--gooey-color', color);
            for (let index = 0; index < 15; index += 1) {
                const angle = (Math.PI * 2 * index) / 15 + (Math.random() - .5) * .35;
                const distance = 24 + Math.random() * 42;
                const particle = document.createElement('span');
                particle.className = 'gooey-particle';
                particle.style.setProperty('--gooey-x', `${Math.cos(angle) * distance}px`);
                particle.style.setProperty('--gooey-y', `${Math.sin(angle) * distance}px`);
                particle.style.setProperty('--gooey-delay', `${Math.round(Math.random() * 110)}ms`);
                particle.style.setProperty('--gooey-duration', `${560 + Math.round(Math.random() * 220)}ms`);
                effect.appendChild(particle);
                particle.addEventListener('animationend', () => particle.remove(), { once: true });
            }
        };

        const syncEffect = () => positionEffect(nav.querySelector('.nav-pill.active') || pills[0]);
        syncEffect();
        window.addEventListener('resize', syncEffect);

        pills.forEach(pill => {
            pill.addEventListener('mouseenter', () => { pill.style.filter = 'brightness(1.1)'; });
            pill.addEventListener('mouseleave', () => { pill.style.filter = 'brightness(1)'; });
            pill.addEventListener('click', event => {
                if (reducedMotion || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || pill.classList.contains('active')) return;

                event.preventDefault();
                pills.forEach(item => item.classList.toggle('active', item === pill));
                positionEffect(pill);
                effect.classList.remove('active');
                void effect.offsetWidth;
                effect.classList.add('active');
                createParticles(pill);

                window.setTimeout(() => { window.location.href = pill.href; }, 480);
            });
        });
    }
});
