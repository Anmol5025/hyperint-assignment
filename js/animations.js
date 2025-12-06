/**
 * Animations - Scroll-triggered animations and hover effects
 * Requirements: 6.1, 6.4
 */

/**
 * AnimationManager - Handles scroll-triggered and hover animations
 */
class AnimationManager {
  constructor() {
    this.observers = [];
    this.animatedElements = new Set();
  }

  /**
   * Initialize all animations
   */
  initialize() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupUrgencyIndicators();
  }

  /**
   * Set up scroll-triggered animations using Intersection Observer
   */
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          const animationType = entry.target.dataset.animate;
          const delay = parseInt(entry.target.dataset.animateDelay || 0, 10);
          
          setTimeout(() => {
            this.applyAnimation(entry.target, animationType);
            this.animatedElements.add(entry.target);
          }, delay);
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    this.observers.push(observer);
  }

  /**
   * Apply animation to element
   */
  applyAnimation(element, animationType) {
    element.classList.add('animated');
    
    switch (animationType) {
      case 'fade-in':
        element.classList.add('fade-in');
        break;
      case 'slide-up':
        element.classList.add('slide-up');
        break;
      case 'slide-left':
        element.classList.add('slide-left');
        break;
      case 'slide-right':
        element.classList.add('slide-right');
        break;
      case 'scale-in':
        element.classList.add('scale-in');
        break;
      case 'bounce-in':
        element.classList.add('bounce-in');
        break;
      default:
        element.classList.add('fade-in');
    }
  }

  /**
   * Set up hover effect utilities
   */
  setupHoverEffects() {
    // Lift effect on hover
    const liftElements = document.querySelectorAll('[data-hover="lift"]');
    liftElements.forEach(element => {
      element.classList.add('hover-lift');
    });
    
    // Glow effect on hover
    const glowElements = document.querySelectorAll('[data-hover="glow"]');
    glowElements.forEach(element => {
      element.classList.add('hover-glow');
    });
    
    // Scale effect on hover
    const scaleElements = document.querySelectorAll('[data-hover="scale"]');
    scaleElements.forEach(element => {
      element.classList.add('hover-scale');
    });
    
    // Tilt effect on hover (3D)
    const tiltElements = document.querySelectorAll('[data-hover="tilt"]');
    tiltElements.forEach(element => {
      this.setupTiltEffect(element);
    });
  }

  /**
   * Set up 3D tilt effect on hover
   */
  setupTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  /**
   * Set up urgency indicator animations
   */
  setupUrgencyIndicators() {
    // Low stock indicators
    const lowStockElements = document.querySelectorAll('[data-urgency="low-stock"]');
    lowStockElements.forEach(element => {
      this.animateLowStock(element);
    });
    
    // Trending indicators
    const trendingElements = document.querySelectorAll('[data-urgency="trending"]');
    trendingElements.forEach(element => {
      this.animateTrending(element);
    });
    
    // Limited time indicators
    const limitedTimeElements = document.querySelectorAll('[data-urgency="limited-time"]');
    limitedTimeElements.forEach(element => {
      this.animateLimitedTime(element);
    });
    
    // Hot deal indicators
    const hotDealElements = document.querySelectorAll('[data-urgency="hot-deal"]');
    hotDealElements.forEach(element => {
      this.animateHotDeal(element);
    });
  }

  /**
   * Animate low stock indicator
   */
  animateLowStock(element) {
    element.classList.add('urgency-low-stock');
    
    // Pulse animation every 3 seconds
    setInterval(() => {
      element.classList.add('pulse');
      setTimeout(() => {
        element.classList.remove('pulse');
      }, 1000);
    }, 3000);
  }

  /**
   * Animate trending indicator
   */
  animateTrending(element) {
    element.classList.add('urgency-trending');
    
    // Continuous subtle animation
    element.style.animation = 'trending-pulse 2s ease-in-out infinite';
  }

  /**
   * Animate limited time indicator
   */
  animateLimitedTime(element) {
    element.classList.add('urgency-limited-time');
    
    // Blink animation
    setInterval(() => {
      element.classList.add('blink');
      setTimeout(() => {
        element.classList.remove('blink');
      }, 500);
    }, 2000);
  }

  /**
   * Animate hot deal indicator
   */
  animateHotDeal(element) {
    element.classList.add('urgency-hot-deal');
    
    // Shake animation on interval
    setInterval(() => {
      element.classList.add('shake');
      setTimeout(() => {
        element.classList.remove('shake');
      }, 500);
    }, 4000);
  }

  /**
   * Add parallax effect to elements
   */
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax || 0.5);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  /**
   * Destroy all observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.animatedElements.clear();
  }
}

/**
 * Utility function to add stagger delay to child elements
 */
function addStaggerDelay(parentSelector, childSelector, baseDelay = 100) {
  const parents = document.querySelectorAll(parentSelector);
  
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
      child.dataset.animateDelay = index * baseDelay;
    });
  });
}

/**
 * Initialize animation manager
 */
function initializeAnimations() {
  const animationManager = new AnimationManager();
  animationManager.initialize();
  
  // Set up parallax if needed
  if (document.querySelector('[data-parallax]')) {
    animationManager.setupParallax();
  }
  
  // Make manager globally accessible
  window.animationManager = animationManager;
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
  initializeAnimations();
}

/**
 * Initialize floating social proof card animations for Variation 2
 */
function initializeFloatingProofAnimations() {
  const proofCards = document.querySelectorAll('.floating-social-proof .proof-card');
  
  if (proofCards.length === 0) return;

  // Stagger entrance animations
  proofCards.forEach((card, index) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Trigger animation with stagger
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, 300 + (index * 150));
    
    // Add subtle hover animation
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.05)';
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
  });

  // Add floating animation loop
  proofCards.forEach((card, index) => {
    const floatAnimation = () => {
      const delay = index * 500;
      const duration = 3000 + (index * 200);
      
      setInterval(() => {
        card.style.transition = `transform ${duration}ms ease-in-out`;
        card.style.transform = 'translateY(-8px)';
        
        setTimeout(() => {
          card.style.transform = 'translateY(0)';
        }, duration / 2);
      }, duration);
    };
    
    setTimeout(floatAnimation, 1000 + (index * 150));
  });
}

// Initialize floating proof animations on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFloatingProofAnimations);
} else {
  initializeFloatingProofAnimations();
}

/**
 * Initialize parallax effect for Variation 3 hero section
 */
function initializeHeroParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-image');
  
  if (!heroSection || !heroImage) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        // Only apply parallax while hero is in view
        if (scrolled < heroHeight) {
          const parallaxOffset = scrolled * 0.5;
          heroSection.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
          heroSection.classList.add('parallax');
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// Initialize hero parallax on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeroParallax);
} else {
  initializeHeroParallax();
}


/**
 * Initialize horizontal scroll functionality for Variation 3
 */
function initializeHorizontalScroll() {
  const scrollContainer = document.querySelector('[data-horizontal-scroll]');
  
  if (!scrollContainer) return;
  
  const gallery = scrollContainer.querySelector('.photo-gallery-horizontal');
  const leftArrow = scrollContainer.querySelector('.scroll-left');
  const rightArrow = scrollContainer.querySelector('.scroll-right');
  const indicators = scrollContainer.querySelectorAll('.indicator');
  
  if (!gallery) return;
  
  // Scroll amount (one card width + gap)
  const scrollAmount = 316; // 300px card + 16px gap
  
  // Left arrow click
  if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      gallery.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
  }
  
  // Right arrow click
  if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      gallery.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }
  
  // Update indicators on scroll
  if (indicators.length > 0) {
    gallery.addEventListener('scroll', () => {
      const scrollPercentage = gallery.scrollLeft / (gallery.scrollWidth - gallery.clientWidth);
      const activeIndex = Math.round(scrollPercentage * (indicators.length - 1));
      
      indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    });
    
    // Indicator click to scroll to section
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        const scrollPosition = (gallery.scrollWidth - gallery.clientWidth) * (index / (indicators.length - 1));
        gallery.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // Keyboard navigation
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      gallery.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else if (e.key === 'ArrowRight') {
      gallery.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  });
  
  // Make gallery focusable for keyboard navigation
  gallery.setAttribute('tabindex', '0');
}

// Initialize horizontal scroll on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHorizontalScroll);
} else {
  initializeHorizontalScroll();
}
