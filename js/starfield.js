// Starfield creation and animation
function createStarfield() {
    const starfield = document.getElementById('starfield');
    
    // Adjust star count based on device performance
    const isMobile = window.innerWidth <= 768;
    const starsCount = isMobile ? 100 : 200;
    
    // Clear existing stars
    starfield.innerHTML = '';
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size (0.5px to 2px)
        const size = Math.random() * 1.5 + 0.5;
        
        // Random animation duration (3s to 8s)
        const duration = Math.random() * 5 + 3;
        
        // Set styles
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);

        // Staggered warp streak timing (negative delay = already mid-streak when warp starts)
        star.style.setProperty('--warp-dur', `${(Math.random() * 0.45 + 0.35).toFixed(2)}s`);
        star.style.setProperty('--warp-delay', `${(-Math.random()).toFixed(2)}s`);

        // Random opacity
        star.style.opacity = Math.random() * 0.8 + 0.2;
        
        starfield.appendChild(star);
    }
}

// Parallax effect for stars on scroll
function parallaxStars() {
    const stars = document.querySelectorAll('.star');
    const scrollY = window.scrollY;
    
    stars.forEach(star => {
        const speed = parseFloat(star.style.width) * 0.1;
        const offset = -scrollY * speed * 0.05;
        star.style.transform = `translateY(${offset}px)`;
    });
}

// Handle window resize for starfield
function handleStarfieldResize() {
    // Recreate starfield on resize for proper scaling
    const starfield = document.getElementById('starfield');
    starfield.innerHTML = '';
    createStarfield();
}

// Check for low performance devices
function checkPerformanceMode() {
    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check if it's a low-powered device (older mobile devices)
    const isLowPower = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
        !/Chrome|Safari|Firefox|Edge/.test(navigator.userAgent);
    
    if (reducedMotion || isLowPower) {
        document.body.classList.add('performance-mode');
    }
}

// Export functions for use in main.js
window.StarfieldModule = {
    createStarfield,
    parallaxStars,
    handleStarfieldResize,
    checkPerformanceMode
};