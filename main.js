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
    const cards = document.querySelectorAll('.project-card');

    const revealOnScroll = () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (cardTop < windowHeight * 0.9) {
                card.classList.add('is-visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Project grid category filter (work page)
    const filterBar = document.querySelector('.project-filter-bar');
    if (filterBar) {
        const pills = Array.from(filterBar.querySelectorAll('.filter-pill'));
        const dropdown = filterBar.querySelector('.filter-dropdown');
        const dropdownTrigger = filterBar.querySelector('.filter-dropdown-trigger');
        const dropdownItems = Array.from(filterBar.querySelectorAll('.filter-dropdown-item'));
        const allControls = [...pills, ...dropdownItems];
        const projectCards = Array.from(document.querySelectorAll('.project-card'));

        const closeDropdown = () => {
            if (!dropdown) return;
            dropdown.classList.remove('is-open');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
        };

        const applyFilter = (category) => {
            allControls.forEach(control => {
                const isMatch = control.dataset.filter === category;
                control.classList.toggle('is-active', isMatch);
                if (control.classList.contains('filter-pill')) {
                    control.setAttribute('aria-pressed', String(isMatch));
                }
            });

            if (dropdown) {
                dropdown.classList.toggle('has-selection', category !== 'all');
            }

            projectCards.forEach(card => {
                const matches = category === 'all' || card.dataset.category === category;
                card.classList.toggle('is-filtered-out', !matches);
            });
        };

        filterBar.addEventListener('click', (e) => {
            if (dropdownTrigger && e.target.closest('.filter-dropdown-trigger')) {
                const isOpen = dropdown.classList.toggle('is-open');
                dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
                return;
            }

            const control = e.target.closest('.filter-pill, .filter-dropdown-item');
            if (!control) return;

            applyFilter(control.dataset.filter);
            closeDropdown();
        });

        document.addEventListener('click', (e) => {
            if (dropdown && dropdown.classList.contains('is-open') && !dropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });
    }

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

    // Featured projects carousel (home page)
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        const cardEls = Array.from(carouselTrack.querySelectorAll('.carousel-card'));
        const dotsWrap = document.querySelector('.carousel-dots');
        const prevBtn = document.querySelector('.carousel-arrow--prev');
        const nextBtn = document.querySelector('.carousel-arrow--next');
        const viewport = document.querySelector('.carousel-viewport');
        const total = cardEls.length;
        let active = 0;
        let autoplayTimer;

        cardEls.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to project ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });
        const dotEls = Array.from(dotsWrap.children);

        function render() {
            cardEls.forEach((card, i) => {
                let offset = (i - active + total) % total;
                if (offset > total / 2) offset -= total;

                let position;
                if (offset === 0) position = 'active';
                else if (offset === 1) position = 'next';
                else if (offset === -1) position = 'prev';
                else if (offset > 0) position = 'hidden-next';
                else position = 'hidden-prev';

                card.dataset.position = position;
            });
            dotEls.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
        }

        function goTo(index) {
            active = ((index % total) + total) % total;
            render();
            restartAutoplay();
        }

        function startAutoplay() {
            autoplayTimer = setInterval(() => goTo(active + 1), 6000);
        }

        function restartAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        prevBtn.addEventListener('click', () => goTo(active - 1));
        nextBtn.addEventListener('click', () => goTo(active + 1));

        cardEls.forEach((card, i) => {
            card.addEventListener('click', (e) => {
                if (card.dataset.position !== 'active') {
                    e.preventDefault();
                    goTo(i);
                }
            });
        });

        viewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goTo(active - 1);
            if (e.key === 'ArrowRight') goTo(active + 1);
        });

        viewport.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        viewport.addEventListener('mouseleave', () => startAutoplay());

        let touchStartX = 0;
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        viewport.addEventListener('touchend', (e) => {
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 40) {
                goTo(active + (delta < 0 ? 1 : -1));
            }
        }, { passive: true });

        render();
        startAutoplay();
    }
});
