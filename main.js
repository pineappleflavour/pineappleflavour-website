document.addEventListener('DOMContentLoaded', () => {
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
