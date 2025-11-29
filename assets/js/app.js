/**
 * Modern Portfolio Site - Powered by rnxJS
 * Reactive UI with declarative state management
 */

import {
    createReactiveState,
    loadComponents,
    registerComponent,
    Button, Card, Input, Badge, Alert, Container, Row, Col
} from '@arnelirobles/rnxjs';

// ============================================
// REACTIVE STATE
// ============================================
const state = createReactiveState({
    searchTerm: '',
    scrollPosition: 0,
    theme: localStorage.getItem('theme') || 'light',
    navbarScrolled: false,
    loadedImages: [],
    stats: {},
    activeFilters: []
});

// ============================================
// 1. REACTIVE SEARCH/FILTER
// ============================================
function initializeSearch() {
    const searchInput = document.querySelector('.md-search-input');
    if (!searchInput) return;

    // Bind input to reactive state
    searchInput.addEventListener('input', (e) => {
        state.searchTerm = e.target.value.toLowerCase();
    });

    // Subscribe to searchTerm changes - automatically updates UI
    state.subscribe('searchTerm', (term) => {
        const items = document.querySelectorAll('.md-article-card, .md-card');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(term);

            item.style.display = matches || !term ? '' : 'none';

            if (matches && term) {
                item.classList.add('md-search-match');
                // Add highlight animation
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = 'md-highlight 0.3s ease';
                }, 10);
            } else {
                item.classList.remove('md-search-match');
            }
        });

        // Update results count if exists
        const resultsCount = document.querySelector('.md-search-results-count');
        if (resultsCount && term) {
            const visibleCount = document.querySelectorAll('[style*="display: none"]').length;
            const totalCount = items.length;
            resultsCount.textContent = `Found ${totalCount - visibleCount} of ${totalCount} items`;
        }
    });
}

// ============================================
// 2. REACTIVE NAVBAR SCROLL
// ============================================
function initializeNavbar() {
    const navbar = document.querySelector('.md-top-app-bar');
    if (!navbar) return;

    // Throttle scroll updates for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(() => {
            state.scrollPosition = window.pageYOffset;
            state.navbarScrolled = state.scrollPosition > 100;
            scrollTimeout = null;
        }, 16); // ~60fps
    });

    // Subscribe to navbarScrolled changes
    state.subscribe('navbarScrolled', (isScrolled) => {
        if (isScrolled) {
            navbar.classList.add('md-scrolled');
        } else {
            navbar.classList.remove('md-scrolled');
        }
    });
}

// ============================================
// 3. REACTIVE COUNTER ANIMATIONS
// ============================================
function initializeCounters() {
    const animateValue = (key, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);

            // Update state reactively
            if (!state.stats[key]) {
                state.stats[key] = currentValue;
            } else {
                state.stats[key] = currentValue;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const key = element.id || element.dataset.key || `stat_${Math.random()}`;
                const endValue = parseInt(element.dataset.count) || 0;

                // Subscribe to this specific stat - DOM updates automatically
                state.subscribe(`stats.${key}`, (value) => {
                    element.textContent = value || 0;
                });

                // Start animation
                animateValue(key, 0, endValue, 2000);
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach((stat, index) => {
        // Ensure each stat has a unique ID
        if (!stat.id) {
            stat.id = `stat_${index}`;
        }
        statsObserver.observe(stat);
    });
}

// ============================================
// 4. REACTIVE CARD INTERACTIONS
// ============================================
function initializeCards() {
    const cards = document.querySelectorAll('.md-card, .md-article-card');

    cards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });

        // Ripple effect on click
        card.addEventListener('click', function (e) {
            // Don't add ripple if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            const ripple = document.createElement('span');
            ripple.classList.add('md-ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// 5. FADE-IN ANIMATIONS
// ============================================
function initializeFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('md-fade-in-active');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.md-card, .md-article-card');
    cards.forEach(card => {
        card.classList.add('md-fade-in');
        fadeInObserver.observe(card);
    });
}

// ============================================
// 6. LAZY LOADING IMAGES WITH REACTIVE STATE
// ============================================
function initializeLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src && !state.loadedImages.includes(img.dataset.src)) {
                    img.src = img.dataset.src;
                    img.classList.add('md-loaded');

                    // Add to loaded images array
                    state.loadedImages = [...state.loadedImages, img.dataset.src];

                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Subscribe to loaded images changes for debugging
    if (isDevelopment()) {
        state.subscribe('loadedImages', (images) => {
            console.log(`📷 Loaded ${images.length} images`);
        });
    }
}

// ============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// 8. BUTTON LOADING STATES
// ============================================
function initializeButtons() {
    document.querySelectorAll('a.md-button').forEach(button => {
        button.addEventListener('click', function (e) {
            if (!this.classList.contains('md-loading')) {
                this.classList.add('md-loading');
                setTimeout(() => {
                    this.classList.remove('md-loading');
                }, 2000);
            }
        });
    });
}

// ============================================
// 9. THEME MANAGEMENT (REACTIVE)
// ============================================
function initializeTheme() {
    // Subscribe to theme changes
    state.subscribe('theme', (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log(`🎨 Theme changed to: ${newTheme}`);
    });

    // Set initial theme
    document.documentElement.setAttribute('data-theme', state.theme);

    // Theme toggle button (if exists)
    const themeToggle = document.querySelector('.md-theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function isDevelopment() {
    return window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
}

// ============================================
// INITIALIZE ALL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing rnxJS-powered portfolio...');

    // Register UI Components with Prefix
    registerComponent('RnxButton', Button);
    registerComponent('RnxCard', Card);
    registerComponent('RnxInput', Input);
    registerComponent('RnxBadge', Badge);
    registerComponent('RnxAlert', Alert);
    registerComponent('RnxContainer', Container);
    registerComponent('RnxRow', Row);
    registerComponent('RnxCol', Col);

    // Initialize Components
    loadComponents();

    initializeSearch();
    initializeNavbar();
    initializeCounters();
    initializeCards();
    initializeFadeInAnimations();
    initializeLazyImages();
    initializeSmoothScroll();
    initializeButtons();
    initializeTheme();

    console.log('✅ Portfolio initialized with rnxJS reactive state management');

    // Debug: Log state changes in development
    if (isDevelopment()) {
        // Subscribe to all top-level state changes for debugging
        Object.keys(state).forEach(key => {
            state.subscribe(key, (value) => {
                console.log(`🔄 State changed [${key}]:`, value);
            });
        });
    }
});

// Export state for debugging in console
if (typeof window !== 'undefined') {
    window.__APP_STATE__ = state;
    window.__RNXJS_DEBUG__ = {
        state,
        getState: () => ({ ...state }),
        resetSearch: () => { state.searchTerm = ''; },
        toggleTheme: () => { state.theme = state.theme === 'light' ? 'dark' : 'light'; }
    };

    console.log('💡 Debug helpers available: window.__RNXJS_DEBUG__');
}
