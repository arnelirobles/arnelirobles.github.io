/**
 * Material Design Interactions & Animations
 * Minimal, performant JavaScript for enhanced UX
 */

(function() {
  'use strict';
  
  // ============================================
  // 1. SCROLL-TRIGGERED FADE-IN ANIMATIONS
  // ============================================
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
  
  // Observe all cards for fade-in on scroll
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.md-card, .md-article-card');
    cards.forEach(card => {
      card.classList.add('md-fade-in');
      fadeInObserver.observe(card);
    });
  });
  
  // ============================================
  // 2. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
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
  
  // ============================================
  // 3. CARD INTERACTIONS
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.md-card, .md-article-card');
    
    cards.forEach(card => {
      // Add hover sound effect class
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
      
      // Add click ripple effect
      card.addEventListener('click', function(e) {
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
  });
  
  // ============================================
  // 4. LOADING STATE FOR LINKS
  // ============================================
  document.querySelectorAll('a.md-button').forEach(button => {
    button.addEventListener('click', function(e) {
      if (!this.classList.contains('md-loading')) {
        this.classList.add('md-loading');
        
        // Remove loading state after 2 seconds if still on page
        setTimeout(() => {
          this.classList.remove('md-loading');
        }, 2000);
      }
    });
  });
  
  // ============================================
  // 5. NAVBAR SCROLL EFFECT
  // ============================================
  let lastScroll = 0;
  const navbar = document.querySelector('.md-top-app-bar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('md-scrolled');
    } else {
      navbar.classList.remove('md-scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ============================================
  // 6. LAZY LOADING IMAGES
  // ============================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('md-loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // ============================================
  // 7. SEARCH/FILTER FUNCTIONALITY
  // ============================================
  const searchInput = document.querySelector('.md-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const items = document.querySelectorAll('.md-article-card, .md-card');
      
      items.forEach(item => {
        const title = item.querySelector('.md-card-title')?.textContent.toLowerCase() || '';
        const text = item.textContent.toLowerCase();
        
        if (title.includes(searchTerm) || text.includes(searchTerm)) {
          item.style.display = '';
          item.classList.add('md-search-match');
        } else {
          item.style.display = 'none';
          item.classList.remove('md-search-match');
        }
      });
    });
  }
  
  // ============================================
  // 8. INTERSECTION OBSERVER FOR STATS/COUNTERS
  // ============================================
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const endValue = parseInt(stat.dataset.count) || 0;
        animateValue(stat, 0, endValue, 2000);
        statsObserver.unobserve(stat);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('[data-count]').forEach(stat => {
    statsObserver.observe(stat);
  });
  
})();
