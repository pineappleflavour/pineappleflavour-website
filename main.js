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

    // Dynamic Theme Toggler Injection
    const nav = document.querySelector('.header .nav');
    if (nav && !document.getElementById('theme-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'nav-pill theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle Theme');
        
        toggleButton.innerHTML = `
            <svg class="theme-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path class="moon-path" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                <circle class="sun-circle" cx="12" cy="12" r="5"></circle>
                <line class="sun-line" x1="12" y1="1" x2="12" y2="3"></line>
                <line class="sun-line" x1="12" y1="21" x2="12" y2="23"></line>
                <line class="sun-line" x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line class="sun-line" x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line class="sun-line" x1="1" y1="12" x2="3" y2="12"></line>
                <line class="sun-line" x1="21" y1="12" x2="23" y2="12"></line>
                <line class="sun-line" x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line class="sun-line" x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        
        nav.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: isDark ? 'dark' : 'light' } }));
        });
    }

    // Sync theme across tabs / scripts
    window.addEventListener('themechanged', (e) => {
        const isDark = e.detail.theme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    });
});
