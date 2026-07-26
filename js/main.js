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

// Scroll with rocket physics: slow build off the pad, full speed, brake on approach
function momentumScrollTo(targetY, onArrive) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(3000, Math.max(1400, Math.abs(distance) * 0.6));
    const t0 = performance.now();
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic

    function step(now) {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, startY + distance * ease(p));
        if (p < 1) {
            requestAnimationFrame(step);
        } else if (onArrive) {
            onArrive();
        }
    }
    requestAnimationFrame(step);
}

function setupMainInteractions() {
    // Launch Mission button: ignition -> reverse warp flight down to the contact pad
    const launchBtn = document.getElementById('launchBtn');
    if (launchBtn) {
        launchBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (!contactSection || this.dataset.flight) return;

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            const btn = this;
            btn.dataset.flight = 'true';
            const originalText = btn.innerHTML;
            btn.disabled = true;

            // Phase 1: ignition — the hero section (button included) rumbles via page-shake
            btn.innerHTML = '<i class="fas fa-fire"></i> Ignition...';
            btn.classList.add('igniting');
            document.body.classList.add('page-shake');

            setTimeout(() => {
                // Phase 2: liftoff — descend to contact at warp (stars streak upward)
                btn.classList.remove('igniting');
                btn.innerHTML = '<i class="fas fa-rocket"></i> Launching...';
                setTimeout(() => document.body.classList.remove('page-shake'), 400);
                setTimeout(() => document.body.classList.add('warp-reverse'), 300);

                momentumScrollTo(contactSection.offsetTop - 20, () => {
                    // Phase 3: arrival — drop out of warp, mission accomplished
                    document.body.classList.remove('warp-reverse');
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Mission Launched!';
                    btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
                    btn.style.borderColor = '#00ff88';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style.background = 'transparent';
                        btn.style.borderColor = 'var(--accent)';
                        delete btn.dataset.flight;
                    }, 2500);
                });
            }, 1100);
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
    
    // Back to top rocket: ignition -> liftoff -> momentum scroll -> landing -> fade
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const IGNITION_MS = 1100;

        window.addEventListener('scroll', function() {
            if (backToTop.dataset.flight) return; // don't hide mid-animation
            backToTop.classList.toggle('visible', window.scrollY > 600);
        });

        backToTop.addEventListener('click', function() {
            if (backToTop.dataset.flight) return;

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            backToTop.dataset.flight = 'true';

            // Phase 1: ignition — flames on, rocket rumbles, page shakes
            backToTop.classList.add('igniting');
            document.body.classList.add('page-shake');

            setTimeout(() => {
                // Phase 2: liftoff — rocket climbs off screen, page follows with building momentum
                backToTop.classList.remove('igniting');
                backToTop.classList.add('launching');
                setTimeout(() => document.body.classList.remove('page-shake'), 400);
                // Stars hit light speed once the rocket is at full throttle
                setTimeout(() => document.body.classList.add('warp-speed'), 500);

                momentumScrollTo(0, () => {
                    // Phase 3: touchdown — drop out of warp, retro-burn descent, then fade out
                    document.body.classList.remove('warp-speed');
                    backToTop.classList.remove('launching');
                    backToTop.classList.add('landing');
                    backToTop.addEventListener('animationend', function onLand() {
                        backToTop.removeEventListener('animationend', onLand);
                        backToTop.classList.add('fading');
                        setTimeout(() => {
                            backToTop.classList.remove('landing', 'fading', 'visible');
                            delete backToTop.dataset.flight;
                        }, 1200);
                    });
                });
            }, IGNITION_MS);
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