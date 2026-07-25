// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeApplication();
});

function initializeApplication() {
    // Initialize starfield
    if (window.StarfieldModule) {
        StarfieldModule.createStarfield();
        StarfieldModule.checkPerformanceMode();
        
        // Add scroll parallax effect
        window.addEventListener('scroll', StarfieldModule.parallaxStars);
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(StarfieldModule.handleStarfieldResize, 250);
        });
    }
    
    // Initialize navigation
    if (window.NavigationModule) {
        NavigationModule.setupSmoothScrolling();
        NavigationModule.setupMobileMenu();
        NavigationModule.setupNavigationScrollEffect();
        NavigationModule.setupActiveSection();
    }
    
    // Initialize animations
    if (window.AnimationsModule) {
        AnimationsModule.setupScrollAnimations();
        AnimationsModule.setupFloatingCards();
        AnimationsModule.setupTypewriterEffect();
        AnimationsModule.setupParticleTrail();
        AnimationsModule.setupButtonEffects();
        AnimationsModule.setupGlowEffects();
    }
    
    // Setup main interactions
    setupMainInteractions();
    // Form submission is handled by contact.js (EmailJS)

    // Setup performance monitoring
    setupPerformanceMonitoring();
}

function setupMainInteractions() {
    // Launch Mission button functionality
    const launchBtn = document.getElementById('launchBtn');
    if (launchBtn) {
        launchBtn.addEventListener('click', function() {
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Button animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-rocket"></i> Mission Launched!';
                this.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
                this.style.borderColor = '#00ff88';
            }, 1500);
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.background = 'transparent';
                this.style.borderColor = 'var(--accent)';
            }, 4000);
        });
    }
    
    // Skill item hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = 'var(--accent-alt)';
            this.style.borderLeftWidth = '5px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = 'var(--accent)';
            this.style.borderLeftWidth = '3px';
        });
    });
    
    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px)';
            }, 150);
        });
    });
    
    // Back to top rocket: launch, land at the top, fade away
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const inFlight = () => backToTop.classList.contains('launching') || backToTop.classList.contains('landing');

        window.addEventListener('scroll', function() {
            if (inFlight()) return; // don't hide mid-animation
            backToTop.classList.toggle('visible', window.scrollY > 600);
        });

        backToTop.addEventListener('click', function() {
            if (inFlight()) return;

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            backToTop.classList.add('launching');

            const checkArrival = () => {
                if (window.scrollY <= 0) {
                    backToTop.classList.remove('launching');
                    backToTop.classList.add('landing');
                    backToTop.addEventListener('animationend', function onLand() {
                        backToTop.removeEventListener('animationend', onLand);
                        backToTop.classList.add('fading');
                        setTimeout(() => {
                            backToTop.classList.remove('landing', 'fading', 'visible');
                        }, 1200);
                    });
                } else {
                    requestAnimationFrame(checkArrival);
                }
            };
            requestAnimationFrame(checkArrival);
        });
    }

    // Discord: no profile URL, copy username instead
    const discordLink = document.getElementById('discordLink');
    if (discordLink) {
        discordLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText('cyb3r.k1d')
                .then(() => showNotification('Discord username copied: cyb3r.k1d', 'success'))
                .catch(() => showNotification('Discord: cyb3r.k1d', 'info'));
        });
    }

    // Social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px var(--accent)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

function setupPerformanceMonitoring() {
    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFrameRate() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS is too low, enable performance mode
            if (fps < 30) {
                document.body.classList.add('performance-mode');
                console.log('Performance mode enabled due to low FPS:', fps);
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFrameRate);
    }
    
    requestAnimationFrame(checkFrameRate);
    
    // Monitor memory usage (if available)
    if (performance.memory) {
        setInterval(() => {
            const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
            
            if (memoryUsage > 0.8) {
                console.warn('High memory usage detected:', memoryUsage);
                document.body.classList.add('performance-mode');
            }
        }, 5000);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc66)' : 
                    type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' : 
                    'linear-gradient(135deg, var(--accent), var(--accent-alt))'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Space Mono', monospace;
        font-size: 0.9rem;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Debug mode
function enableDebugMode() {
    console.log('🚀 Space Portfolio Debug Mode Enabled');
    
    // Add debug info
    const debugInfo = document.createElement('div');
    debugInfo.id = 'debug-info';
    debugInfo.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: var(--accent);
        padding: 0.5rem;
        border-radius: 5px;
        font-family: 'Space Mono', monospace;
        font-size: 0.8rem;
        z-index: 10000;
        display: none;
    `;
    
    document.body.appendChild(debugInfo);
    
    // Toggle debug info with Ctrl+D
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const debugEl = document.getElementById('debug-info');
            debugEl.style.display = debugEl.style.display === 'none' ? 'block' : 'none';
            
            if (debugEl.style.display === 'block') {
                updateDebugInfo();
                setInterval(updateDebugInfo, 1000);
            }
        }
    });
    
    function updateDebugInfo() {
        const debugEl = document.getElementById('debug-info');
        if (debugEl && debugEl.style.display === 'block') {
            debugEl.innerHTML = `
                Screen: ${window.innerWidth}x${window.innerHeight}<br>
                Scroll: ${Math.round(window.scrollY)}px<br>
                Stars: ${document.querySelectorAll('.star').length}<br>
                Performance: ${document.body.classList.contains('performance-mode') ? 'LOW' : 'NORMAL'}
            `;
        }
    }
}

// Enable debug mode in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    enableDebugMode();
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Space Portfolio Error:', e.error);
    showNotification('A cosmic error occurred. Please refresh the page.', 'error');
});

// Export for global access
window.SpacePortfolio = {
    showNotification,
    enableDebugMode
};