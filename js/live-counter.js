/**
 * LiveCounter - Animated counter for displaying real-time metrics
 * Requirements: 2.1, 2.2, 2.5
 */
class LiveCounter {
  constructor(targetValue, duration = 2000, element = null) {
    this.targetValue = targetValue;
    this.currentValue = 0;
    this.duration = duration;
    this.element = element;
    this.animationId = null;
    this.startTime = null;
    this.isRunning = false;
  }

  /**
   * Easing function for smooth animation (easeOutExpo)
   */
  easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /**
   * Start the counter animation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = performance.now();
    this.animate();
  }

  /**
   * Animation loop
   */
  animate() {
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    // Apply easing function
    const easedProgress = this.easeOutExpo(progress);
    this.currentValue = Math.floor(easedProgress * this.targetValue);
    
    // Update DOM element if provided
    if (this.element) {
      this.element.textContent = this.currentValue.toLocaleString();
    }
    
    // Continue animation or complete
    if (progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.currentValue = this.targetValue;
      if (this.element) {
        this.element.textContent = this.targetValue.toLocaleString();
      }
    }
  }

  /**
   * Stop the counter animation
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  /**
   * Update the target value and restart animation
   */
  update(newTargetValue) {
    this.stop();
    this.targetValue = newTargetValue;
    this.currentValue = 0;
    this.start();
  }

  /**
   * Get current value
   */
  getCurrentValue() {
    return this.currentValue;
  }

  /**
   * Add pulse animation to element
   */
  addPulseAnimation() {
    if (this.element) {
      this.element.classList.add('pulse-active');
      setTimeout(() => {
        this.element.classList.remove('pulse-active');
      }, 1000);
    }
  }
}

/**
 * Initialize all live counters on the page
 */
function initializeLiveCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  
  counterElements.forEach(element => {
    const targetValue = parseInt(element.dataset.counter, 10);
    const duration = parseInt(element.dataset.duration || 2000, 10);
    
    const counter = new LiveCounter(targetValue, duration, element);
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counter.isRunning) {
          counter.start();
          
          // Add pulse animation for active metrics
          if (element.dataset.pulse === 'true') {
            counter.addPulseAnimation();
          }
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(element);
  });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLiveCounters);
} else {
  initializeLiveCounters();
}
